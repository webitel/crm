<template>
  <wt-dual-panel
    :actions-panel="false"
    class="opened-case"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!isNew && !editMode"
        :primary-action="saveCase"
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
      <opened-case-general :namespace="namespace" />
    </template>
    <template #main>
      <opened-case-tabs :namespace="namespace" />
    </template>
  </wt-dual-panel>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import OpenedCaseGeneral from './opened-case-general.vue';
import OpenedCaseTabs from './opened-case-tabs.vue';
import { useStore } from 'vuex';
import casesAPI from '../api/CasesAPI.js';
import UsersAPI from '@webitel/ui-sdk/src/api/clients/users/users.js';

const namespace = 'cases';

const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

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
  deleteItem,
} = useCardStore(namespace);

const {
  isNew,
  pathName,
  disabledSave,
  saveText,
  save,
  initialize,
} = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
});

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
      name: id.value ? `${itemInstance.value?.name} ${itemInstance.value?.subject}` : t('reusable.new'),
    },
  ];
});

const userinfo = computed(() => store.state.userinfo);
const userContact = ref({});

const isCaseAssignable = computed(() => {
  return (
    itemInstance.assignee?.name !== userContact.value.id && userContact.value.id
  );
});

async function fetchUserContact(userId) {
  if (!userId) {
    userContact.value = {};
    return;
  }

  try {
    const user = await UsersAPI.get({ itemId: userId });
    userContact.value = user?.contact || {};
  } catch (err) {
    throw err;
  }
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

  try {
    await casesAPI.patch({
      changes: {
        assignee: { id: userContact.value.id, name: userContact.value.name },
      },
      etag: itemInstance.value.etag,
    });
  } catch (err) {
    throw err;
  } finally {
    await loadItem();
  }
}

const editMode = computed(() => {
  return isNew.value || store.getters[`${cardNamespace}/EDIT_MODE`];
});

provide('editMode', editMode);

async function toggleEditMode(value) {
  await store.dispatch(`${cardNamespace}/TOGGLE_EDIT_MODE`, value);
}

const saveCase = () => {
  toggleEditMode(false);
  save();
};

initialize();
</script>

<style lang="scss" scoped>
.opened-case {
  &__actions-wrapper {
    display: flex;
    gap: var(--spacing-sm);
  }
}
</style>
