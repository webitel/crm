<template>
  <table-filters-panel
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
import { ContactsSearchMode } from '@webitel/api-services/api';
import type { DataField } from '@webitel/api-services/gen/models';
import { TableFiltersPanelComponent as TableFiltersPanel } from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';

import { filtersOptions } from '../configs/filtersOptions';
import { useContactsDatalistStore } from '../stores/datalist/contactsDatalistStore';

const emit = defineEmits<{
	hide: [];
}>();

defineProps<{
	extensionFields: DataField[];
}>();

const tableStore = useContactsDatalistStore();
const { filtersManager } = storeToRefs(tableStore);
const { addFilter, updateFilter, deleteFilter } = tableStore;

const resetFilters = () => {
	filtersManager.value.reset({
		exclude: Object.values(ContactsSearchMode),
	});
};
</script>
