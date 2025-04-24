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
        edit: actionAllow,
        delete: actionAllow,
        add: actionAllow,
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
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const isReadOnly = inject('isReadOnly');
const editMode = inject('editMode');
const customFields = inject('customFields');

const { t } = useI18n();
const route = useRoute();

const { disableUserInput } = useUserAccessControl();
const { namespace: cardNamespace, id } = useCardStore(props.namespace);

const actionAllow = computed(() => !disableUserInput && editMode.value && !isReadOnly.value);

const CASE_VIEW_NAME = 'case_view';
const currentCardRoute = computed(() => {
  return typeof route.name === 'string' && route.name.includes(CASE_VIEW_NAME) ?
    CASE_VIEW_NAME :
    CrmSections.CASES;
});

const tabs = computed(() => {
  const tabs = [
    {
      text: t('cases.caseInfo.caseInfo'),
      value: 'case-info',
      pathName: `${currentCardRoute.value}-case-info`,
    },
    {
      text: t('cases.result'),
      value: 'result',
      pathName: `${currentCardRoute.value}-result`,
    },
    {
      text: t('timeline.timeline'),
      value: 'timeline',
      pathName: `${currentCardRoute.value}-timeline`,
    },
  ];

  const attachments = {
    text: t('cases.attachments.attachments'),
    value: 'attachments',
    pathName: `${currentCardRoute.value}-attachments`,
  };

  if (id.value) tabs.push(attachments);

  if (customFields.value.length) {
    tabs.push({
      text: t('cases.details.details'),
      value: 'details',
      pathName: `${currentCardRoute.value}-details`,
    });
  }

  const permissions = {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${currentCardRoute.value}-permissions`,
  };

  if (id.value) tabs.push(permissions);

  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);
</script>
