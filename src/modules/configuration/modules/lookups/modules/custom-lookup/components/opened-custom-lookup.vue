<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :hide-primary="!hasSaveActionAccess"
        :primary-action="save"
        :primary-disabled="!isAnyFieldEdited || hasValidationErrors"
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
import { AdjunctTypesAPI } from '@webitel/api-services/api';
import type { DataInputDictionary } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { customLookupFields } from '../stores/_internals/customLookupFields';
import { useCustomLookupCardStore } from '../stores/card/customLookupCardStore';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { handleError } = useErrorRedirectHandler();

const repo = computed(() => route.params.repo as string);

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const cardStore = useCustomLookupCardStore();

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
	useCardStore: useCustomLookupCardStore,
	onLoadErrorHandler: handleError,
	manualSetup: true,
});

const close = () => {
	router.push({
		name: 'custom-lookup',
		params: {
			repo: repo.value,
		},
	});
};

const tabs = computed(() => {
	const general = {
		text: t('customization.customLookups.columns'),
		value: 'general',
		pathName: 'custom-lookup-record-columns',
	};

	return [
		general,
	];
});

const { currentTab, changeTab } = useCardTabs(tabs);

const dictionary = ref<DataInputDictionary | null>(null);

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
			name: dictionary.value?.name,
			route: {
				name: 'custom-lookup',
				params: {
					repo: repo.value,
				},
			},
		},
		{
			name: isNew.value ? t('reusable.new') : originalItemInstance.value?.name,
		},
	];
});

// the `:repo/:id` route is shared by every custom-lookup dictionary/record
// (same route record), so switching dictionaries or records does NOT remount
// this component — re-fetch the schema and re-init the card store explicitly
watch(
	[
		repo,
		() => route.params.id,
	],
	async ([newRepo, id]) => {
		if (!newRepo) return;

		cardStore.$reset();

		dictionary.value = await AdjunctTypesAPI.get({
			itemId: newRepo as string,
		});
		customLookupFields.value = dictionary.value?.fields ?? [];

		await cardStore.initialize({
			itemId: id as string,
			parentId: newRepo as string,
		});
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	cardStore.$reset();
});
</script>

<style lang="scss" scoped></style>
