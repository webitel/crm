<template>
  <dynamic-filter-panel-wrapper>
    <template #filters>

      <dynamic-filter-preview
        v-for="filter of appliedFilters"
        :key="filter.name"
        :filter="filter"
        disable-click-away
        @delete:filter="deleteAppliedFilter($event.name)"
      >
        <template #form="{ hide }">
          <dynamic-filter-config-form
            :options="getAppliedFiltersOptions(filter)"
            :filter="filter"
            @submit="
              (data) => setFilterWrapperAction(data, updateAppliedFilter, hide)
            "
            @cancel="() => hide()"
          >
            <template
              #value-input="{
                filterName,
                filterValue,
                onValueChange,
                onValueInvalidChange,
              }"
            >
              <component
                :is="FilterOptionToValueComponentMap[filterName]"
                :key="filterName"
                :model-value="filterValue"
                @update:model-value="onValueChange"
                @update:invalid="onValueInvalidChange"
              />
            </template>
          </dynamic-filter-config-form>
        </template>

        <template #info>
          <component
            :is="FilterOptionToPreviewComponentMap[filter.name]"
            :value="filter.value"
          >
          </component>
        </template>
      </dynamic-filter-preview>

      <dynamic-filter-add-action :show-label="!appliedFilters.length">
        <template #form="{ hide }">
          <dynamic-filter-config-form
            :options="unappliedFilters"
            @submit="(data) => setFilterWrapperAction(data, applyFilter, hide)"
            @cancel="() => hide()"
          >
            <template
              #value-input="{
                filterName,
                filterValue,
                onValueChange,
                onValueInvalidChange,
              }"
            >
              <component
                :is="FilterOptionToValueComponentMap[filterName]"
                :key="filterName"
                :model-value="filterValue"
                @update:model-value="onValueChange"
                @update:invalid="onValueInvalidChange"
              />
            </template>
          </dynamic-filter-config-form>
        </template>
      </dynamic-filter-add-action>
    </template>

    <template #actions>
      <apply-preset-action
        :namespace="CasesNamespace"
        :use-presets-store="createFilterPresetsStore(CasesNamespace)"
        @apply="applyPreset"
      />

      <save-preset-action
        :namespace="CasesNamespace"
        :filters-manager="filtersManager"
      />

      <wt-icon-action
        action="clear"
        @click="resetFilters"
      />

      <wt-icon-action
        action="close"
        @click="emit('hide')"
      />
    </template>
  </dynamic-filter-panel-wrapper>
</template>

<script lang="ts" setup>
import {
  ApplyPresetAction,
  createFilterPresetsStore,
  SavePresetAction,
} from '@webitel/ui-sdk/src/modules/Filters/v2/filter-presets/index';
import DynamicFilterConfigForm from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/config/dynamic-filter-config-form.vue';
import DynamicFilterAddAction from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-add-action.vue';
import DynamicFilterPanelWrapper from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-panel-wrapper.vue';
import {FilterOptionToPreviewComponentMap, FilterOptionToValueComponentMap } from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/filter-options/index';
import DynamicFilterPreview from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/preview/dynamic-filter-preview.vue';
import type {
  FilterInitParams,
  FilterName,
  IFilter,
} from '@webitel/ui-sdk/src/modules/Filters/v2/filters/types/Filter.d.ts';
import { storeToRefs } from 'pinia';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { CasesNamespace } from '../namespace';
import { useCasesStore } from '../stores/cases';
import { filtersOptions } from './filters-options';
import { SearchMode } from './SearchMode';

const emit = defineEmits<{
  hide: [];
}>();

const { t } = useI18n();
const tableStore = useCasesStore();
const { filtersManager } = storeToRefs(tableStore);

const {
  addFilter: applyFilter,
  updateFilter: updateAppliedFilter,
  deleteFilter: deleteAppliedFilter,
} = tableStore;

function setFilterWrapperAction(
  data: FilterInitParams,
  filterAction: (d: FilterInitParams) => IFilter,
  closeCb: () => void,
) {
  filterAction(data);
  closeCb();
}

const appliedFilters = computed(() => {
  const exclude = Object.values(SearchMode);
  return filtersManager.value.getFiltersList({ exclude });
});

const unappliedFilters: Ref<Array<{ name: string; value: FilterName }>> =
  computed(() => {
    const excludeNames = new Set(
      filtersManager.value.getFiltersList().map((item) => item.name),
    );

    return filtersOptions
      .filter((key) => !excludeNames.has(key))
      .map((key) => ({
        name: t(`webitelUI.filters.${key}`),
        value: key,
      }));
  });

const getAppliedFiltersOptions = (filter: IFilter) => {
  const filterData = {
    name: t(`webitelUI.filters.${filter.name}`),
    value: filter.name,
  };
  return [...unappliedFilters.value, filterData];
};

const resetFilters = () => {
  filtersManager.value.reset();
};

const applyPreset = (snapshot) => {
  filtersManager.value.reset();
  filtersManager.value.fromString(snapshot);
};
</script>
