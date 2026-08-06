<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="isPrimaryDisabled"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <wt-loader v-if="debouncedIsLoading" />
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
            :access="{ read: true, update: !disableUserInput, delete: !disableUserInput, create: !disableUserInput }"
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
import type { WebitelCasesCatalog } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useCaseServiceCatalogsCardStore } from '../stores';
import prettifyBreadcrumbName from '../utils/prettifyBreadcrumbName.js';

const { t } = useI18n();
const { handleError } = useErrorRedirectHandler();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const {
	modelValue,

	debouncedIsLoading,
	originalItemInstance,

	isNew,
	saveText,
	hasValidationErrors,
	isAnyFieldEdited,
	validationFields,

	save,
} = useCardComponent<WebitelCasesCatalog>({
	useCardStore: useCaseServiceCatalogsCardStore,
	onLoadErrorHandler: handleError,
});

const { close } = useClose(CrmSections.ServiceCatalogs);

const isPrimaryDisabled = computed(
	() =>
		!hasSaveActionAccess.value ||
		!isAnyFieldEdited.value ||
		hasValidationErrors.value,
);

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
			name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
			route: '/configuration/lookups/service-catalogs',
		},
		{
			name: isNew.value
				? t('reusable.new')
				: prettifyBreadcrumbName(originalItemInstance.value?.name),
		},
	];
});
</script>

<style
  scoped
  lang="scss"
></style>
