<template>
  <article class="opened-card-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    />
    <router-view
      :namespace="cardNamespace"
      :access="/*is used by permissions tab*/ {
        read: true,
        edit: !disableUserInput && editMode,
        delete: !disableUserInput && editMode,
        add: !disableUserInput && editMode,
      }"
      :fields="customFields"
      class="opened-card-tabs__tab"
    />
  </article>
</template>

<script setup>
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const editMode = inject('editMode');
const customFields = inject('customFields');

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();
const { namespace: cardNamespace, id } = useCardStore(props.namespace);

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
    {
      text: t('timeline.timeline'),
      value: 'timeline',
      pathName: `${CrmSections.CASES}-timeline`,
    },
  ];

  const attachments = {
    text: t('cases.attachments.attachments'),
    value: 'attachments',
    pathName: `${CrmSections.CASES}-attachments`,
  };

  if (id.value) tabs.push(attachments);

  if (customFields.value.length) {
    tabs.push({
      text: t('cases.details.details'),
      value: 'details',
      pathName: `${CrmSections.CASES}-details`,
    });
  }

  const permissions = {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${CrmSections.CASES}-permissions`,
  };

  if (id.value) tabs.push(permissions);

  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);
</script>
