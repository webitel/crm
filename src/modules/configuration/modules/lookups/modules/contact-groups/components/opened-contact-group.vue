<template>
  <wt-page-wrapper
    :actions-panel="!!currentTab.filters"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!hasSaveActionAccess"
        :primary-action="save"
        :primary-disabled="disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #actions-panel>
      <component
        :is="currentTab.filters"
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
            :namespace="cardNamespace"
            :access="{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import TypeContactGroupsEnum from '../enums/TypeContactGroups.enum.js';

const namespace = 'configuration/lookups/contactGroups';
const { t } = useI18n();
const route = useRoute();

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  ...restStore
} = useCardStore(namespace);

const { isNew, pathName, disabledSave, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});
const { hasSaveActionAccess, disableUserInput } = useAccessControl();

const { close } = useClose(CrmSections.CONTACT_GROUPS);

const tabs = computed(() => {
  const general = {
    text: t('reusable.general'),
    value: 'general',
    pathName: `${CrmSections.CONTACT_GROUPS}-general`,
  };

  const conditions = {
    text: t('lookups.slas.conditions', 2),
    value: 'conditions',
    pathName: `${CrmSections.CONTACT_GROUPS}-conditions`,
  };

  const permissions = {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${CrmSections.CONTACT_GROUPS}-permissions`,
  };

  const tabs = [general];

  if (itemInstance.value.type === TypeContactGroupsEnum.DYNAMIC) tabs.push(conditions);
  if (id.value) tabs.push(permissions);

  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);

const path = computed(() => {

  return [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.sources.sources', 2), route: '/lookups/contact-groups' },
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
