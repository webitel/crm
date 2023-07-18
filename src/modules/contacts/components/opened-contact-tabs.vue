<template>
  <article class="opened-contact-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    ></wt-tabs>
    <component
      class="opened-contact-tab"
      :is="currentTab.component"
      :namespace="namespace"
    ></component>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Communications from './opened-contact-communications.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const currentTab = ref({});

const tabs = computed(() => [
  // {
  //   text: t('contacts.timeline.timeline'),
  //   value: 'timeline',
  // },
  {
    text: t('contacts.communications.communications', 2),
    value: 'communications',
    component: Communications,
  },
  // {
  //   text: t('vocabulary.variables', 2),
  //   value: 'variables',
  // },
  // {
  //   text: t('vocabulary.permissions', 2),
  //   value: 'permissions',
  // },
]);

function changeTab(tab) {
  currentTab.value = tab;
}

function initializeTab() {
  changeTab(tabs.value[0]);
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
  padding: var(--spacing-sm);
  box-shadow: var(--elevation-10);

  .opened-contact-tab {
    flex-grow: 1;
    display: flex;
    min-height: 0;
  }
}
</style>
