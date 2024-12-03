<template>
  <article class="opened-card-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    />
    <router-view
      :edit-mode="editMode"
      :namespace="namespace"
      class="opened-card-tabs__tab"
    />
  </article>
</template>

<script setup>
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const tabs = computed(() => [
  {
    text: t('cases.caseInfo.caseInfo'),
    value: 'case-info',
    pathName: `${CrmSections.CASES}-case-info`,
  },
]);

const {
  currentTab,
  changeTab,
} = useCardTabs(tabs);
</script>

<style lang="scss" scoped>
</style>
