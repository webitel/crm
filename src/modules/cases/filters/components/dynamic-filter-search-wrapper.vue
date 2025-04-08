<template>
  <dynamic-filter-search
    :model-value="searchValue"
    :search-mode="searchMode"
    :show-text-search-icon="showTextSearchIcon"
    :search-mode-options="filteredSearchOptions"
    @handle-search="handleSearch"
    @update:search-mode="searchMode = $event"
  />
</template>

<script lang="ts" setup>
import { configurations } from '@webitel/ui-sdk/src/api/clients/index.js';
import DynamicFilterSearch from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-search.vue';
import { storeToRefs } from 'pinia';
import { computed, ref, watch, WatchHandle } from 'vue';
import {useI18n} from "vue-i18n";
import { EngineSystemSettingName } from 'webitel-sdk';

import { useCasesStore } from '../../stores/cases';
import { SearchMode, SearchModeType } from '../SearchMode';

const tableStore = useCasesStore();
const { t } = useI18n();

const { filtersManager, isFiltersRestoring } = storeToRefs(tableStore);

const { hasFilter, addFilter, updateFilter, deleteFilter } = tableStore;

const searchMode = ref<SearchModeType>(SearchMode.Search);
const searchValue = ref('');
const isFTSEnabled = ref(false);

const showTextSearchIcon = computed(() => {
  const textSearchModes = [SearchMode.Fts];

  return textSearchModes.includes(searchMode.value);
});

const filteredSearchOptions = computed(() => {
  const options = isFTSEnabled.value ? SearchMode : { Search: SearchMode.Search };

  return Object.values(options).map((mode) => {
    return {
      value: mode,
      text: t(`filters.search.${mode}`),
    };
  })
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

const loadV = async () => {
  const configurationsData = await configurations.getList({
    name: [EngineSystemSettingName.IsFulltextSearchEnabled],
  });

  const regex = configurationsData.items.find(
    ({ name }) => name === EngineSystemSettingName.IsFulltextSearchEnabled,
  )?.value;

  isFTSEnabled.value = regex;
};

loadV();
</script>

<style lang="scss" scoped></style>
