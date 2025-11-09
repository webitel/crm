<template>
  <dynamic-filter-search
    :filters-manager="filtersManager"
    :value="searchValue"
    :is-filters-restoring="isFiltersRestoring"
    @filter:add="addFilter"
    @filter:update="updateFilter"
    @filter:delete="deleteFilter"
  />
</template>

<script lang="ts" setup>
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { computed } from 'vue';

import { createAddContactsInGroupComposableTableStore } from '../stores/addContactsInGroup';

const props = defineProps<{
  useTableStore: ReturnType<typeof createAddContactsInGroupComposableTableStore>;
}>();

const tableStore = props.useTableStore();

const { filtersManager, isFiltersRestoring } = tableStore;

const { addFilter, updateFilter, deleteFilter } = tableStore;

const searchValue = computed(() => filtersManager.value.filters.get('search')?.value || '');
</script>
