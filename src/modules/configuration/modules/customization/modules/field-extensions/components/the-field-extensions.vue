<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
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
        <opened-custom-lookup-columns
          :item-instance="(modelValue as { fields: ColumnField[] })"
          :title="t(`customization.extensions.${repo}`)"
        />
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup lang="ts">
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import { computed, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import OpenedCustomLookupColumns from '../../custom-lookups/components/opened-custom-lookup-columns.vue';
import type { ColumnField } from '../../custom-lookups/types/customLookupField';
import { useFieldExtensionsCardStore } from '../stores/card/fieldExtensionsCardStore';

const { t } = useI18n();
const route = useRoute();

const repo = computed(() => route.params.id as string);

const cardStore = useFieldExtensionsCardStore();
const { initialize, $reset } = cardStore;

const {
	modelValue,
	debouncedIsLoading,
	isAnyFieldEdited,
	hasValidationErrors,
	saveText,
	save,
} = useCardComponent({
	useCardStore: useFieldExtensionsCardStore,
	manualSetup: true,
});

const { close } = useClose('customization');

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
			name: repo.value && t(`customization.extensions.${repo.value}`),
		},
	];
});

// the `types-extensions/:id` route is shared by every extendable entity
// (cases/contacts, same route record), so switching between them does NOT
// remount this component — re-init the card store explicitly on repo change.
watch(
	repo,
	(newRepo) => {
		if (!newRepo) return;

		$reset();
		initialize({
			itemId: newRepo,
		});
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	$reset();
});
</script>

<style lang="scss" scoped></style>
