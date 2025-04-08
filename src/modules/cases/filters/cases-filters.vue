<template>
  <table-filters-panel
    :filters-manager="filtersManager"
    :filter-options="filtersOptions"
    :preset-namespace="namespace"
    :use-presets-store="useCaseFilterPresetsStore"
    @filter:add="addFilter"
    @filter:update="updateFilter"
    @filter:delete="deleteFilter"
    @filter:reset-all="resetFilters"
    @preset:apply="applyPreset"
    @hide="emit('hide')"
  />
</template>

<script lang="ts" setup>
import {TableFiltersPanelComponent as TableFiltersPanel} from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';

import { CasesNamespace as namespace } from '../namespace';
import { useCasesStore } from '../stores/cases';
import { useCaseFilterPresetsStore } from '../stores/useCaseFilterPresetsStore';
import { filtersOptions } from './filters-options';

const emit = defineEmits<{
  hide: [];
}>();

const tableStore = useCasesStore();
const { filtersManager } = storeToRefs(tableStore);

const {
  addFilter,
  updateFilter,
  deleteFilter,
} = tableStore;

const resetFilters = () => {
  filtersManager.value.reset();
};

const applyPreset = (snapshot: string) => {
  resetFilters();
  filtersManager.value.fromString(snapshot);
};
</script>
