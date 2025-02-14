<template>
  <article class="opened-card-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    />
    <router-view
      :namespace="cardNamespace"
      class="opened-card-tabs__tab"
    />
  </article>
</template>

<script setup>
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const {
  namespace: cardNamespace,
  id,
} = useCardStore(props.namespace);

const tabs = computed(() => {
  const tabs = [
    {
      text: t('cases.caseInfo.caseInfo'),
      value: 'case-info',
      pathName: `${CrmSections.CASES}-case-info`,
    },
    {
      text: t('cases.result'),
      value: 'result',
      pathName: `${CrmSections.CASES}-result`,
    },
  ];

  const attachments = {
    text: t('cases.attachments.attachments'),
    value: 'attachments',
    pathName: `${CrmSections.CASES}-attachments`,
  };

  const permissions = {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${CrmSections.CASES}-permissions`,
  };

  if (id.value) tabs.push(attachments, permissions);

  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);
</script>

<style lang="scss" scoped></style>
