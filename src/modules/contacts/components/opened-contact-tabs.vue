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
    />
  </article>
</template>

<script setup>
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const tabs = computed(() => [
  {
    text: t('timeline.timeline'),
    value: 'timeline',
    pathName: `${CrmSections.CONTACTS}-timeline`,
  },
  {
    text: t('contacts.communications.communications', 2),
    value: 'communications',
    pathName: `${CrmSections.CONTACTS}-communications`,
  },
  {
    text: t('contacts.attributes', 2),
    value: 'variables',
    pathName: `${CrmSections.CONTACTS}-variables`,
  },
  {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${CrmSections.CONTACTS}-permissions`,
  },
]);

const currentTab = computed(() => {
  return tabs.value.find(({ pathName }) => route?.matched?.find(({name}) => name === pathName));
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
