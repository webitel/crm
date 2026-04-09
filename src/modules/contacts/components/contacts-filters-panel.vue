<template>
  <table-filters-panel
    v-if="!isLoadingExtensionFields"
    :filters-manager="filtersManager"
    :filter-options="filtersOptions"
    :filterable-extension-fields="extensionFields"
    @filter:add="addFilter"
    @filter:update="updateFilter"
    @filter:delete="deleteFilter"
    @filter:reset-all="resetFilters"
    @hide="emit('hide')"
  />
</template>

<script lang="ts" setup>
import { TableFiltersPanelComponent as TableFiltersPanel } from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';

import { useExtensionFields } from '../../customization/modules/wt-type-extension/composable/useExtensionFields';
import { filtersOptions } from '../configs/filtersOptions';
import { useContactsStore } from '../stores/contacts';

const emit = defineEmits<{
	hide: [];
}>();

const tableStore = useContactsStore();
const { filtersManager } = storeToRefs(tableStore);

const { addFilter, updateFilter, deleteFilter } = tableStore;

const {
	fields: extensionFields,
	isLoading: isLoadingExtensionFields,
	getFields,
} = useExtensionFields({
	type: 'contacts',
});

getFields();

const resetFilters = () => {
	filtersManager.value.reset({
		exclude: [
			'labels',
			'name',
			'about',
			'variables',
			'destination',
		],
	});
};
</script>
