<template>
  <dynamic-filter-panel-wrapper>
    <template #filters>
      <dynamic-filter-preview
        v-for="filter of appliedFilters"
        :key="filter.name"
        :filter="filter"
        @delete:filter="deleteAppliedFilter($event.name)"
      >
        <template #form>
          <dynamic-filter-config-form
            :filter="filter"
            :style-options="getFilterFieldComponentOptions(filter.name)"
            @submit="updateAppliedFilter"
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
                :is="getFilterFieldComponent(filterName, 'valueField')"
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
            :is="getFilterFieldComponent(filter.name, 'previewField')"
            :value="filter.value"
          >
          </component>
        </template>
      </dynamic-filter-preview>

      <dynamic-filter-add-action :show-label="!appliedFilters.length">
        <template #form="{ hide }">
          <dynamic-filter-config-form
            :options="unappliedFilters"
            @submit="(data) => applyFilterWrapper(data, hide)"
            @cancel="hide"
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
                :is="getFilterFieldComponent(filterName, 'valueField')"
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
      <!--        TODO: <save-preset-action />-->

      <wt-icon-action
        action="close"
        @click="emit('hide')"
      />
    </template>
  </dynamic-filter-panel-wrapper>
</template>

<script lang="ts" setup>
import DynamicFilterConfigForm from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/config/dynamic-filter-config-form.vue';
import DynamicFilterAddAction from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-add-action.vue';
import DynamicFilterPanelWrapper from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-panel-wrapper.vue';
import DynamicFilterPreview from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/preview/dynamic-filter-preview.vue';
import { FilterName } from '@webitel/ui-sdk/src/modules/Filters/v2/filters/types/Filter.d.ts';
import { storeToRefs } from 'pinia';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCasesStore } from '../stores/cases';
import { filtersConfig } from './filters-config.ts';
import { SearchMode } from './SearchMode.ts';

const emit = defineEmits<{
  hide: [];
}>();

const { t } = useI18n();
const tableStore = useCasesStore();
const { filtersManager } = storeToRefs(tableStore);
window.fmanager = filtersManager;

const {
  addFilter: applyFilter,
  updateFilter: updateAppliedFilter,
  deleteFilter: deleteAppliedFilter,
} = tableStore;

function applyFilterWrapper(data, closeCb) {
  applyFilter(data);
  closeCb();
}

const appliedFilters = computed(() => {
  const exclude = Object.values(SearchMode);
  const filters = filtersManager.value.getFiltersList({ exclude });
  return filters.map((item) => {
    return {
      ...item,
      styleOptions: getFilterFieldComponentOptions(item.name),
    };
  });
});

const getFilterFieldComponentOptions = (filterName: FilterName) => {
  const filter = filtersConfig[filterName];
  return !filter ? undefined : filter.styleOptions || undefined;
};

const unappliedFilters: Ref<Array<{ name: string; value: FilterName }>> =
  computed(() => {
    const filterOptions = Object.keys(filtersConfig).map((key) => ({
      name: t(`webitelUI.filters.${key}`),
      value: key,
      styleOptions: getFilterFieldComponentOptions(key),
    }));

    return filterOptions;
  });

const getFilterFieldComponent = (
  filterName: FilterName,
  filterField: 'valueField' | 'previewField',
) => {
  const filter = filtersConfig[filterName];
  return !filter ? '' : filter[filterField] || '';
};
</script>
