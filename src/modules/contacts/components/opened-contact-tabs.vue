<template>
  <article class="opened-contact-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    ></wt-tabs>
    <router-view
      class="opened-contact-tab"
      :namespace="namespace"
    ></router-view>
  </article>
</template>

<script setup>
import { computed, onMounted } from 'vue';
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
  // {
  //   text: t('contacts.timeline.timeline'),
  //   value: 'timeline',
  // },
  {
    text: t('contacts.communications.communications', 2),
    value: 'communications',
    pathName: 'communications',
  },
  // {
  //   text: t('vocabulary.variables', 2),
  //   value: 'variables',
  // },
  {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: 'permissions'
  },
]);

const currentTab = computed(() => tabs.value.find(({ pathName }) => pathName === route.name));

function changeTab(tab) {
  return router.push({ name: tab.pathName });
}

function initializeTab() {
  if (!currentTab.value) changeTab(tabs.value[0]);
}

onMounted(() => {
  initializeTab();
});
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
