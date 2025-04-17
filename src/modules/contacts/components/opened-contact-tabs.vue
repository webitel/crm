<template>
  <article class="opened-contact-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    />
    <router-view
      class="opened-contact-tab"
      :namespace="namespace"
      :fields="customFields"
    />
  </article>
</template>

<script setup>
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useExtensionFields } from '../../customization/modules/wt-type-extension/composable/useExtensionFields';

defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { fields: customFields, getFields } = useExtensionFields({
  type: 'contacts',
});

getFields();

const currentCardRoute = computed(() => {
  if (typeof route.name !== 'string') return CrmSections.CONTACTS;
  return route.name.includes('contact_view') ? 'contact_view' : CrmSections.CONTACTS;
});

const tabs = computed(() => {
  const tabList = [
    {
      text: t('timeline.timeline'),
      value: 'timeline',
      pathName: `${currentCardRoute.value}-timeline`,
    },
    {
      text: t('cases.case', 2),
      value: 'cases',
      pathName: `${currentCardRoute.value}-cases`,
    },
    {
      text: t('contacts.communications.communications', 2),
      value: 'communications',
      pathName: `${currentCardRoute.value}-communications`,
    },
    {
      text: t('contacts.attributes', 2),
      value: 'variables',
      pathName: `${currentCardRoute.value}-variables`,
    },
  ];

  if (customFields.value.length) {
    tabList.push({
      text: t('contacts.details'),
      value: 'details',
      pathName: `${currentCardRoute.value}-details`,
    });
  }

  tabList.push({
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${currentCardRoute.value}-permissions`,
  });

  return tabList;
});

const currentTab = computed(() => {
  return tabs.value.find(({ pathName }) =>
    route?.matched?.find(({ name }) => name === pathName),
  )
});

function changeTab(tab) {
  return router.push({ name: tab.pathName });
}
</script>

<style lang="scss" scoped>
.opened-contact-tabs {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  min-width: 0;
  padding: var(--spacing-sm);
  box-shadow: var(--elevation-10);

  .opened-contact-tab {
    flex-grow: 1;
    display: flex;
    min-height: 0;
  }
}
</style>
