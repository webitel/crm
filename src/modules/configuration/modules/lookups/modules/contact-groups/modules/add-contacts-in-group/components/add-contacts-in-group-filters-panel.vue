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

import { filtersOptions } from '../configs/filtersOptions';
import { createAddContactsInGroupComposableTableStore } from '../stores/addContactsInGroup';

const props = defineProps<{
  useTableStore: ReturnType<typeof createAddContactsInGroupComposableTableStore>;
}>();

const tableStore = props.useTableStore();

const { filtersManager } = tableStore;

const {
  addFilter,
  updateFilter,
  deleteFilter,
} = tableStore;

const resetFilters = () => {
  filtersManager.value.reset();
};
</script>
