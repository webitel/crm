<template>
  <article class="opened-contact-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    ></wt-tabs>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const currentTab = ref({});

const tabs = computed(() => [
  {
    text: t('contacts.timeline.timeline'),
    value: 'timeline',
    namespace: props.namespace,
  }, {
    text: t('contacts.communications.communications', 1),
    value: 'communications',
    namespace: `${props.namespace}/communications`,
  }, {
    text: t('vocabulary.variables', 2),
    value: 'variables',
    namespace: props.namespace,
  },{
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    namespace: props.namespace,
  },
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
  min-height: 0;
  padding: var(--spacing-sm);
  box-shadow: var(--elevation-10);
}
</style>
