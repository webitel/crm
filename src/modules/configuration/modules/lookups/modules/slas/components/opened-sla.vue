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
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>

    <template #actions-panel>
      <component
        :is="currentTab.filters"
        :namespace="SLANamespace"
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
import { minValue,required } from '@vuelidate/validators';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { SLANamespace } from '../namespace.js';

const { t } = useI18n();
const route = useRoute();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  ...restStore
} = useCardStore(SLANamespace);

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: { required },
    calendar: { required },
    reactionTime: { required, minValue: minValue(1) },
    resolutionTime: { required, minValue: minValue(1) },
  },
})), { itemInstance }, { $autoDirty: true });

v$.value.$touch();

const { isNew, pathName, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});

const { close } = useClose(CrmSections.SLAS);
const disabledSave = computed(() => v$.value?.$invalid || !itemInstance.value._dirty);

const tabs = computed(() => {
  const general = {
    text: t('reusable.general'),
    value: 'general',
    pathName: `${CrmSections.SLAS}-general`,
  };
  const conditions = {
    text: t('lookups.slas.conditions', 2),
    value: 'conditions',
    pathName: `${CrmSections.SLAS}-conditions`,
  };

  const tabs = [general];

  if (id.value) tabs.push(conditions);
  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);

const path = computed(() => {

  return [
    { name: t('crm'), route: '/start-page' },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.slas.slas', 2), route: '/lookups/slas' },
    {
      name: isNew.value ? t('reusable.new') : pathName.value,
      route: {
        name: currentTab.value.pathName,
        query: route.query,
      },
    },
  ];
});

initialize();
</script>

<style lang="scss" scoped>
</style>
