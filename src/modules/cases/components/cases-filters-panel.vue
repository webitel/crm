<template>
  <table-filters-panel
    v-if="!isLoadingExtensionFields"
    :filters-manager="filtersManager"
    :filter-options="filtersOptions"
    :preset-namespace="namespace"
    :use-presets-store="presetsStore"
    :filterable-extension-fields="extensionFields"
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

import { useExtensionFields } from '../../customization/modules/wt-type-extension/composable/useExtensionFields';
import { filtersOptions } from '../configs/filtersOptions';
import { CasesNamespace } from '../namespace';
import { useCasesStore } from '../stores/cases';
import { useCaseFilterPresetsStore } from '../stores/useCaseFilterPresetsStore';

const emit = defineEmits<{
  hide: [];
}>();

const props = defineProps({

  /* https://webitel.atlassian.net/browse/WTEL-6419?focusedCommentId=666054

   * Description why data is thrown props and have a default value */

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

const {
  fields: extensionFields,
  isLoading: isLoadingExtensionFields,
  getFields,
} = useExtensionFields({
  type: 'cases',
});

getFields();

const resetFilters = () => {
  filtersManager.value.reset({ exclude: ['search'] });
};

const applyPreset = (snapshot: string) => {
  resetFilters();
  filtersManager.value.fromString(snapshot);
};
</script>
