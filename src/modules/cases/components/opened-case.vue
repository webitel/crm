<template>
  <wt-page-wrapper
    :actions-panel="false"
    class="opened-case opened-card"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!isNew"
        :primary-text="t('reusable.save')"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />

        <template #actions>
          <wt-button
            v-if="!isNew"
            color="secondary"
          >{{ t('reusable.edit') }}
          </wt-button>
        </template>
      </wt-page-header>
    </template>
    <template #main>
      <div class="opened-case-content">
        <div class="opened-case-content__general">
          <opened-case-general />
        </div>
        <div class="opened-case-content__tabs">
          <wt-tabs
            :current="currentTab"
            :tabs="tabs"
            @change="changeTab"
          />
          <router-view
            :namespace="namespace"
          />
        </div>
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import OpenedCaseGeneral from './opened-case-general.vue';

const namespace = 'cases';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const {
  namespace: cardNamespace,
  id,
  itemInstance,

  loadItem,
  setId,
  resetState,
  deleteItem,
  ...restStore
} = useCardStore(namespace);

const isLoading = ref(true);

const path = computed(() => {
  const baseUrl = '/cases';

  return [
    { name: t('crm') },
    {
      name: t('cases.case', 2),
      route: baseUrl,
    },
    {
      name: itemInstance.value?.name || 'Cases',
      route: `/cases/${id.value}`,
    },
  ];
});

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
} = useCardTabs(tabs.value);

const { close } = useClose('cases');

const {
  isNew,
  save,
  initialize,
} = useCardComponent({
  ...restStore,
  itemInstance,
  setId,
  loadItem,
  resetState,
});

initialize();
</script>


<style lang="scss" scoped>
</style>
