<template>
  <dynamic-filter-search
    v-if="isFTSConfigLoaded"
    :filters-manager="filtersManager"
    :is-filters-restoring="isFiltersRestoring"
    :search-mode-options="searchModeOptions"
    @filter:add="addFilter"
    @filter:update="updateFilter"
    @filter:delete="deleteFilter"
  />
</template>

<script lang="ts" setup>
import { ConfigurationsAPI } from '@webitel/api-services/api';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { EngineSystemSettingName } from 'webitel-sdk';

import { SearchMode } from '../enums/SearchMode';
import { useCasesStore } from '../stores/cases';

const props = defineProps({

  /* https://webitel.atlassian.net/browse/WTEL-6419?focusedCommentId=666054

 * Description why data is thrown props and have a default value */


  tableStore: {
    type: Object,
    default: () => useCasesStore(),
  },
});

const { t } = useI18n();

const { filtersManager, isFiltersRestoring } = storeToRefs(props.tableStore);

const { addFilter, updateFilter, deleteFilter } = props.tableStore;

const isFTSEnabled = ref();
const isFTSConfigLoaded = ref(false);

const searchModeOptions = computed(() => {
  const options = Object.values(SearchMode).map((mode) => {
    const opt = {
      value: mode,
      text: t(`filters.search.${mode}`),
    };

    if (mode === SearchMode.Fts) {
      opt.icon = 'sst-search';
    }

    return opt;
  });

  if (!isFTSEnabled.value) {
    return options.filter((option) => option.value !== SearchMode.Fts);
  }

  return options;
});

const loadFtsSearchConfiguration = async () => {
  try {
    const { items } = await ConfigurationsAPI.getList({
      name: [EngineSystemSettingName.IsFulltextSearchEnabled],
    });

    isFTSEnabled.value = !!items.some(
      ({ name }) => name === EngineSystemSettingName.IsFulltextSearchEnabled,
    );
  } finally {
    isFTSConfigLoaded.value = true;
  }
};

loadFtsSearchConfiguration();
</script>

<style lang="scss" scoped></style>
