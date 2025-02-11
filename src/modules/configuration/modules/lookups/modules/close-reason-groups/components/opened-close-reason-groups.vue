<template>
  <wt-page-wrapper
    :actions-panel="!!currentTab.filters"
  >
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!hasSaveActionAccess || disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #actions-panel>
      <component
        :is="currentTab.filters"
        :v="v$"
        :namespace="namespace"
      />
    </template>

    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @change="changeTab"
        />
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :v="v$"
            :namespace="cardNamespace"
            :access="/*is used by permissions tab*/{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
          />
        </router-view>
        <input
          hidden
          type="submit"
        > <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const namespace = 'configuration/lookups/closeReasonGroups';

const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  addItem,
  updateItem,
  loadItem,
  setId,
  ...restStore
} = useCardStore(namespace);

const { isNew, pathName, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
  addItem,
  updateItem,
  loadItem,
  setId,
});

const { close } = useClose(CrmSections.CLOSE_REASON_GROUPS);

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: { required },
  },
})), { itemInstance }, { $autoDirty: true });

v$.value.$touch();

const disabledSave = computed(() => v$.value?.$invalid || !itemInstance.value._dirty);

const tabs = computed(() => {
  const general = {
    text: t('reusable.general'),
    value: 'general',
    pathName: `${CrmSections.CLOSE_REASON_GROUPS}-general`,
  };
  const closeReasons = {
    text: t('lookups.closeReasonGroups.reason', 2),
    value: 'closeReasons',
    pathName: `close-reasons`,
  };

  const tabs = [general];

  if (id.value) tabs.push(closeReasons);
  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);


const path = computed(() => {

  return [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.closeReasonGroups.closeReasonGroups', 2), route: '/lookups/close-reason-groups' },
    { name: isNew.value ? t('reusable.new') : pathName.value },
  ];
});

initialize();
</script>

<style lang="scss" scoped>
</style>
