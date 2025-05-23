<template>
  <table-filters-panel
    :filters-manager="filtersManager"
    :filter-options="filtersOptions"
    @filter:add="addFilter"
    @filter:update="updateFilter"
    @filter:delete="deleteFilter"
    @filter:reset-all="initializeDefaultFilter"
  />
</template>

<script lang="ts" setup>
import { TableFiltersPanelComponent as TableFiltersPanel } from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';
import { computed, provide } from 'vue';

import { filtersOptions } from '../configs/filtersOptions';
import { useContactsListStore } from '../stores/contactsList';

const tableStore = useContactsListStore();
const { filtersManager } = storeToRefs(tableStore);

const {
  filterMode,
  addFilter,
  updateFilter,
  deleteFilter,
} = tableStore;

const isStaticMode = computed(() => filterMode === 'static');
provide('isStaticMode', isStaticMode);

const initializeDefaultFilter = () => {
  filtersOptions.forEach((filter) => {
    addFilter({ name: filter.name });
  });
};

initializeDefaultFilter();


</script>

