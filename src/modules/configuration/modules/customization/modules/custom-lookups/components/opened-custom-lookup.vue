<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="disabledSave"
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
            :model-value="modelValue"
            :validation-fields="validationFields"
            :item-instance="modelValue"
            :is-new="isNew"
            :access="{
              read: true,
              update: !disableUserInput,
              delete: !disableUserInput,
              create: !disableUserInput,
            }"
          />
        </router-view>
        <input
          hidden
          type="submit"
        />
        <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script lang="ts" setup>
import { useCardComponent } from '@webitel/ui-datalist/card';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useCustomLookupsCardStore } from '../stores/card/customLookupsCardStore';

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
} = useCardComponent({
	useCardStore: useCustomLookupsCardStore,
	onLoadErrorHandler: handleError,
});

const { close } = useClose(CrmSections.CustomLookups);

const disabledSave = computed(
	() =>
		!hasSaveActionAccess.value ||
		!isAnyFieldEdited.value ||
		hasValidationErrors.value,
);

const tabs = computed(() => {
	const general = {
		text: t('reusable.general'),
		value: 'general',
		pathName: `${CrmSections.CustomLookups}-general`,
	};
	const columns = {
		text: t('customization.customLookups.columns', 2),
		value: 'columns',
		pathName: `${CrmSections.CustomLookups}-columns`,
	};

	const tabs = [
		general,
	];

	if (!isNew.value) tabs.push(columns);
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
			name: t('objects.customization.customization'),
			route: '/configuration',
		},
		{
			name: t('objects.customLookup.customLookup', 2),
			route: {
				name: CrmSections.CustomLookups,
			},
		},
		{
			name: isNew.value ? t('reusable.new') : originalItemInstance.value?.name,
		},
	];
});
</script>

<style
  lang="scss"
  scoped
></style>
