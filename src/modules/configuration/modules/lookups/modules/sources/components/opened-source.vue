<template>
  <wt-page-wrapper
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!hasSaveActionAccess || !isAnyFieldEdited || hasValidationErrors"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <wt-loader
        v-if="debouncedIsLoading"
      />
      <form
        v-else
        class="main-container"
        @submit.prevent="save"
      >
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            v-model="modelValue"
            :validation-fields="validationFields"
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

<script lang="ts" setup>
import { useCardComponent } from '@webitel/ui-datalist/card';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useCaseSourcesCardStore } from '../stores';
// import {WebitelCasesSource} from "@webitel/api-services/gen";

const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const {
  // models
  modelValue,

  // state
  debouncedIsLoading,
  originalItemInstance,

  // computed
  isNew,
  saveText,
  hasValidationErrors,
  isAnyFieldEdited,
  validationFields,

  // actions
  save,
} = useCardComponent/*<WebitelCasesSource>*/({
  useCardStore: useCaseSourcesCardStore,
});

const path = computed(() => {
  return [
    { name: t('crm'), route: '/start-page' },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.sources.sources', 2), route: '/lookups/sources' },
    { name: isNew.value ? t('reusable.new') : originalItemInstance.value?.name },
  ];
});

const { close } = useClose(CrmSections.Sources);
</script>

<style lang="scss" scoped>
</style>
