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
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useAddContactsInGroupStore } from '../stores/addContactsInGroup';

const tableStore = useAddContactsInGroupStore();
const { filtersManager, isFiltersRestoring } = storeToRefs(tableStore);

const {
  addFilter,
  updateFilter,
  deleteFilter,
} = tableStore;

const searchValue = computed(() => filtersManager.value.filters.get('search')?.value || '');
</script>

