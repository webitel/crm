<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!hasSaveActionAccess || !isAnyFieldEdited || hasValidationErrors"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />
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
            v-model="modelValue"
            :validation-fields="validationFields"
            :access="/*is used by permissions tab*/{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
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

<script setup lang="ts">
import type { WebitelCasesPriority } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useCasePrioritiesCardStore } from '../stores/card/casePrioritiesCardStore';

const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();
const { handleError } = useErrorRedirectHandler();

const {
	modelValue,
	isNew,
	saveText,
	isAnyFieldEdited,
	validationFields,
	hasValidationErrors,
	originalItemInstance,
	save,
} = useCardComponent<WebitelCasesPriority>({
	useCardStore: useCasePrioritiesCardStore,
	onLoadErrorHandler: handleError,
});

const path = computed(() => {
	return [
		{
			name: t('crm'),
			route: '/start-page',
		},
		{
			name: t('startPage.configuration.name'),
			route: '/configuration',
		},
		{
			name: t('lookups.lookups'),
			route: '/configuration',
		},
		{
			name: t('vocabulary.priority', 2),
			route: '/configuration/lookups/priorities',
		},
		{
			name: isNew.value ? t('reusable.new') : originalItemInstance.value?.name,
		},
	];
});

const { close } = useClose(CrmSections.Priorities);
</script>
