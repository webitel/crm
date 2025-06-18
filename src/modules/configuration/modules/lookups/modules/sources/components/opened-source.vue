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
import { useCardComponent, useCardValidation,useItemCardSaveText } from '@webitel/ui-datalist/card';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import { storeToRefs } from 'pinia';
import { computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useCaseSourcesCardStore } from '../stores';

const { t } = useI18n();
const route = useRoute();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const { id: routeId } = route.params;

const formStore = useCaseSourcesCardStore();

const {
  itemId,
  originalItemInstance,
  validationSchema,
  isLoading,
  // isSaving, // todo: use me
  // error, // todo: use me
} = storeToRefs(formStore);

const {
  initialize,
  saveItem,
  $reset: resetStore,
} = formStore;

onUnmounted(resetStore);

initialize({
  itemId: routeId as string,
});

const {
  modelValue,
  validationFields,
  hasValidationErrors,
  validate,
} = useCardValidation({ validationSchema });

const {
  debouncedIsLoading,
  save,
  isNew
} = useCardComponent({
  itemId,
  isLoading,
  saveItem,
  validate,
});

const isAnyFieldEdited = true; // todo

const { saveText } = useItemCardSaveText({
  isNew,
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
