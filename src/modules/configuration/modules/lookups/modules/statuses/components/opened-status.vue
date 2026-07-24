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
      <wt-loader v-if="debouncedIsLoading" />
      <form
        v-else
        class="main-container"
        @submit.prevent="save"
      >
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @change="changeTab"
        />

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
import type { WebitelCasesStatus } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useCardTabs, useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useCaseStatusesCardStore } from '../stores';

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
} = useCardComponent<WebitelCasesStatus>({
	useCardStore: useCaseStatusesCardStore,
	onLoadErrorHandler: handleError,
});

const { close } = useClose(CrmSections.Statuses);

const tabs = computed(() => {
	const general = {
		text: t('reusable.general'),
		value: 'general',
		pathName: `${CrmSections.Statuses}-general`,
	};
	const statusConditions = {
		text: t('lookups.statuses.statuses', 2),
		value: 'statuses',
		pathName: `status-conditions`,
	};

	const tabs = [
		general,
	];

	if (!isNew.value) tabs.push(statusConditions);
	return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);

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
			name: t('lookups.statuses.statuses', 2),
			route: '/configuration/lookups/statuses',
		},
		{
			name: isNew.value ? t('reusable.new') : originalItemInstance.value?.name,
		},
	];
});
</script>

<style lang="scss" scoped></style>
