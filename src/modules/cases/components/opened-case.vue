<template>
  <wt-dual-panel
    v-if="!isLoading"
    :actions-panel="false"
    :hide-header="isReadOnly"
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
        <wt-breadcrumb :path="path" />

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
      <opened-case-general :is-new="isNew"/>
    </template>

    <template #main>
      <opened-case-tabs
        :namespace="namespace"
        :v="v$"
      />
    </template>
  </wt-dual-panel>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { UsersAPI } from '@webitel/api-services/api';
import { isEmpty } from '@webitel/ui-sdk/scripts';
import { useCachedItemInstanceName }
  from '@webitel/ui-sdk/src/composables/useCachedItemInstanceName/useCachedItemInstanceName.js';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import {
  useCardStore,
} from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, inject, onUnmounted, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import {
  useExtensionFields,
} from '../../customization/modules/wt-type-extension/composable/useExtensionFields';
import { ErrorRedirectMap } from '../../error-pages/enems/ErrorRedirectMap.enum.js';
import casesAPI from '../api/CasesAPI.js';
import OpenedCaseGeneral from './opened-case-general.vue';
import OpenedCaseTabs from './opened-case-tabs.vue';

const namespace = 'cases';

const store = useStore();
const { t } = useI18n();

const editMode = computed(() => {
  return isNew.value || store.getters[`${cardNamespace}/EDIT_MODE`];
});

const { fields: customFields, getFields } = useExtensionFields({
  type: 'cases',
});

getFields();

const isReadOnly = inject('isReadOnly');
provide('namespace', namespace);
provide('editMode', editMode);
provide('customFields', customFields);

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
} = useCardStore(namespace, {
  errorRedirectMap: ErrorRedirectMap,
}
);

function requiredIfFinal(value, state, siblings) {
  if (!state.statusCondition?.final) {
    return true;
  }
  return required.$validator(value, state, siblings);
}

const v$ = useVuelidate(
  computed(() => {
    // reduce custom fields for set validation rules
    const custom = customFields.value.reduce((acc, field) => {
      if (field.required) {
        acc[field.id] = {
          required,
        };
      }

      return acc;
    }, {});

    return {
      itemInstance: {
        subject: { required },
        // sla: { required }, /* sla is required, but cannot be changed in the ui */
        priority: {
          required,
        } /* priority is required, but set automatically by default and can't be cleared in the ui */,
        source: { required },
        reporter: {
          required: (v) => {
            return !isEmpty(v);
          },
        },
        custom,
        // impacted: { required }, /* is required, but set to "reporter" by default and can't be cleared in the ui */
        service: { required },
        statusCondition: { required }, /* status is required, but set automatically after user selects a service */
        closeReason: { required: requiredIfFinal }, /* closeReason is required if status is final, if status is !final this must be empty field */
        closeResult: { required: requiredIfFinal }, /* closeResult is required if status is final, if status is !final this must be empty field  */
      },
    };
  }),
  { itemInstance },
  { $autoDirty: true },
);

provide(
  'v$',
  computed(() => v$),
);

v$.value.$touch();

const { isNew, disabledSave, isLoading, save, initialize } = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  errorRedirectMap: ErrorRedirectMap,

  invalid: computed(() => v$.value.$invalid),
});

initialize();

const { close } = useClose(CrmSections.CASES);

const { name: breadcrumbSubject } = useCachedItemInstanceName(itemInstance, { namePath: 'subject' });

const path = computed(() => {
  const baseUrl = '/cases';

  return [
    { name: t('crm'), route: '/start-page' },
    {
      name: t('cases.case', 2),
      route: baseUrl,
    },
    {
      name: id.value
        ? `${itemInstance.value?.name} ${breadcrumbSubject.value}`
        : t('reusable.new'),
    },
  ];
});

const userinfo = computed(() => store.state.userinfo);
const userContact = ref({});

const isCaseAssignable = computed(() => {
  return (
    userContact.value.id &&
    itemInstance.value.assignee?.id !== userContact.value.id
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

/**
 * @author @Oleksandr Palonnyi
 *
 * [WTEL-6779] (https://webitel.atlassian.net/browse/WTEL-6779)
 *
 * This watcher is needed to set the id of the casesCard in readonly mode
 * because in readonly mode we have etag as param in url,
 * and some tabs cant get data from etag, so we need to set id from card get response
 *
 * */
watch(() => itemInstance.value.id, (val) => {
  if (val && isReadOnly) {
    setId(val)
  }
})

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

onUnmounted(() => {
  toggleEditMode(false);
});
</script>

<style lang="scss" scoped>
.opened-case {
  &__actions-wrapper {
    display: flex;
    gap: var(--spacing-sm);
  }
}
</style>
