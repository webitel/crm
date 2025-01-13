<template>
  <wt-page-wrapper
    :actions-panel="false"
  >
    <template #header>
      <!-- TODO :hide-primary="!hasSaveActionAccess"-->
      <wt-page-header
        :primary-action="save"
        :primary-disabled="disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :namespace="cardNamespace"
            :access="{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
          />
        </router-view>
        <input
          hidden
          type="submit"
        > <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';

const namespace = 'configuration/lookups/priorities';
const { t } = useI18n();
const route = useRoute();

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  ...restStore
} = useCardStore(namespace);

const { isNew, pathName, disabledSave, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});
const { hasSaveActionAccess, disableUserInput } = useAccessControl();

const { close } = useClose(CrmSections.PRIORITIES);

const path = computed(() => {

  return [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.priorities.priorities', 2), route: '/lookups/priorities' },
    {
      name: isNew.value ? t('reusable.new') : pathName.value,
    },
  ];
});

initialize();
</script>

<style lang="scss" scoped>
</style>
