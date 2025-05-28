<template>
  <table-filters-panel
    :filters-manager="filtersManager"
    :filter-options="filtersOptions"
    static-mode
    @filter:add="addFilter"
    @filter:update="updateFilter"
    @filter:delete="deleteFilter"
    @filter:reset-all="resetFilters"
  />
</template>

<script lang="ts" setup>
import { TableFiltersPanelComponent as TableFiltersPanel } from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';

import { filtersOptions } from '../configs/filtersOptions';
import { useAddContactsInGroupStore } from '../stores/addContactsinGroup';

const tableStore = useAddContactsInGroupStore();
const { filtersManager } = storeToRefs(tableStore);

const {
  addFilter,
  updateFilter,
  deleteFilter,
} = tableStore;

const resetFilters = () => {
  filtersManager.value.reset();
};
</script>
