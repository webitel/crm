<template>
  <dynamic-filter-search
    :model-value="searchValue"
    :search-mode="searchMode"
    :show-text-search-icon="showTextSearchIcon"
    :search-mode-options="SearchMode"
    @handle-search="handleSearch"
    @update:search-mode="searchMode = $event"
  />
</template>

<script lang="ts" setup>
import DynamicFilterSearch from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-search.vue';
import { storeToRefs } from 'pinia';
import { computed, ref, watch, WatchHandle } from 'vue';

import { useCasesStore } from '../../stores/cases';
import { SearchModeType } from '../enums/SearchMode';
import { SearchMode } from '../SearchMode';

const tableStore = useCasesStore();

const { filtersManager, isFiltersRestoring } = storeToRefs(tableStore);

const { hasFilter, addFilter, updateFilter, deleteFilter } = tableStore;

const searchMode = ref<SearchModeType>(SearchMode.Search);
const searchValue = ref('');

const showTextSearchIcon = computed(() => {
  const textSearchModes = [SearchMode.Fts];

  return textSearchModes.includes(searchMode.value);
});

let unwatchSearchMode: WatchHandle;

watch(
  isFiltersRestoring,
  (next) => {
    if (next) return;

    for (const mode of Object.values(SearchMode)) {
      if (hasFilter(mode)) {
        searchMode.value = mode;
        searchValue.value = filtersManager.value.filters.get(mode).value;

        break;
      }
    }

    /**
     * start watching for searchMode change
     * only after initial searchMode restoration
     */
    if (unwatchSearchMode) {
      unwatchSearchMode();
    }

    unwatchSearchMode = watch(searchMode, (_, prev) => {
      deleteFilter(prev);
      searchValue.value = '';
    });
  },
  { immediate: true },
);

const handleSearch = (val: string) => {
  const filter = {
    name: searchMode.value,
    value: val,
  };

  if (hasFilter(searchMode.value)) {
    if (val) {
      updateFilter(filter);
    } else {
      deleteFilter(searchMode.value);
    }
  } else {
    addFilter(filter);
  }
};
</script>

<style lang="scss" scoped></style>
