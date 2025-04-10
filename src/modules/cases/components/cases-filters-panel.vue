<template>
  <table-filters-panel
    :filters-manager="filtersManager"
    :filter-options="filtersOptions"
    :preset-namespace="namespace"
    :use-presets-store="presetsStore"
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

import { filtersOptions } from '../configs/filtersOptions';
import { CasesNamespace } from '../namespace';
import { useCasesStore } from '../stores/cases';
import { useCaseFilterPresetsStore } from '../stores/useCaseFilterPresetsStore';

const emit = defineEmits<{
  hide: [];
}>();

const props = defineProps({

  /* Сomponent can accept props. By default, it works with store for the Сases table,
   * since the component is written primarily for it.
   * But you can throw the props of the required page and use the component on this page */

  namespace: {
    type: String,
    default: CasesNamespace,
  },
  tableStore: {
    type: Object,
    default: () => useCasesStore(),
  },
  presetsStore: {
    type: Object,
    default: () => useCaseFilterPresetsStore,
  }
});

const { filtersManager } = storeToRefs(props.tableStore);

const {
  addFilter,
  updateFilter,
  deleteFilter,
} = props.tableStore;

const resetFilters = () => {
  filtersManager.value.reset();
};

const applyPreset = (snapshot: string) => {
  resetFilters();
  filtersManager.value.fromString(snapshot);
};
</script>
