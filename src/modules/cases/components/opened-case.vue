<template>
  <wt-dual-panel
    :actions-panel="false"
    class="opened-case"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!isNew && !editMode"
        :primary-action="saveCase"
        :primary-disabled="!hasSaveActionAccess || disabledSave"
        :primary-text="t('reusable.save')"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />

        <template #actions>
          <div class="opened-case__actions-wrapper">
            <wt-button
              :disabled="!isCaseAssignable"
              color="success"
              @click="assignCaseToMe"
            >
              {{ t('cases.assignToMe') }}
            </wt-button>

            <wt-button
              v-if="!isNew && !editMode"
              :disabled="!hasUpdateAccess"
              color="secondary"
              @click="toggleEditMode(true)"
            >
              {{ t('reusable.edit') }}
            </wt-button>
          </div>
        </template>
      </wt-page-header>
    </template>
    <template #side-panel>
      <opened-case-general />
    </template>
    <template #main>
      <opened-case-tabs
        :v="v$"
        :namespace="namespace"
      />
    </template>
  </wt-dual-panel>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import UsersAPI from '@webitel/ui-sdk/src/api/clients/users/users.js';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import casesAPI from '../api/CasesAPI.js';
import OpenedCaseGeneral from './opened-case-general.vue';
import OpenedCaseTabs from './opened-case-tabs.vue';

const namespace = 'cases';

const store = useStore();
const { t } = useI18n();

const editMode = computed(() => {
  return isNew.value || store.getters[`${cardNamespace}/EDIT_MODE`];
});

provide('namespace', namespace);
provide('editMode', editMode);

const { hasUpdateAccess, hasSaveActionAccess } = useUserAccessControl();

const {
  namespace: cardNamespace,
  id,
  itemInstance,

  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  setItemProp,
} = useCardStore(namespace);

const v$ = useVuelidate(
  computed(() => ({
    itemInstance: {
      subject: { required },
      sla: { required },
      priority: { required },
      status: { required },
      // close: { required }, // TODO
    },
  })),
  { itemInstance },
  { $autoDirty: true },
);

provide('v$', v$);

v$.value.$touch();

const { isNew, disabledSave, save, initialize } = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,

  invalid: v$.value.$invalid,
});

initialize();

const { close } = useClose(CrmSections.CASES);

const path = computed(() => {
  const baseUrl = '/cases';

  return [
    { name: t('crm') },
    {
      name: t('cases.case', 2),
      route: baseUrl,
    },
    {
      name: id.value
        ? `${itemInstance.value?.name} ${itemInstance.value?.subject}`
        : t('reusable.new'),
    },
  ];
});

const userinfo = computed(() => store.state.userinfo);
const userContact = ref({});

const isCaseAssignable = computed(() => {
  return (
    userContact.value.id &&
    itemInstance.value.assignee?.id !== userContact.value.id &&
    hasUpdateAccess.value
  );
});

async function fetchUserContact(userId) {
  if (!userId) {
    userContact.value = {};
    return;
  }
  const user = await UsersAPI.get({ itemId: userId });
  userContact.value = user?.contact || {};
}

watch(
  () => userinfo.value?.userId,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      await fetchUserContact(newVal);
    }
  },
  { immediate: true },
);

async function assignCaseToMe() {
  if (!userContact.value?.id) {
    return;
  }

  if (editMode.value) {
    await setItemProp({
      path: 'assignee',
      value: { id: userContact.value.id, name: userContact.value.name },
    });
  } else {
    try {
      await casesAPI.patch({
        changes: {
          assignee: { id: userContact.value.id, name: userContact.value.name },
        },
        etag: itemInstance.value.etag,
      });
    } finally {
      await loadItem();
    }
  }
}

const toggleEditMode = (value) => {
  return store.dispatch(`${cardNamespace}/TOGGLE_EDIT_MODE`, value);
};

const saveCase = async () => {
  await save();
  await toggleEditMode(false);
};
</script>

<style lang="scss" scoped></style>
<style lang="scss" scoped>
.opened-case {
  &__actions-wrapper {
    display: flex;
    gap: var(--spacing-sm);
  }
}
</style>
