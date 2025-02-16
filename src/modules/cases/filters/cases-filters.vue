<template>
  <section class="the-history-filters">
    <dynamic-filter-add-action>
      <template #form>
        <dynamic-filter-config-form
          :options="unappliedFilters"
          @submit="applyFilter"
        >
          <template #value-input="{ filterName, filterValue, onValueChange, onValueInvalidChange }">
            <component
              :is="getFilterValueComponent(filterName)"
              :key="filterName"
              :model-value="filterValue"
              @update:model-value="onValueChange"
              @update:invalid="onValueInvalidChange"
            />
          </template>
        </dynamic-filter-config-form>
      </template>
    </dynamic-filter-add-action>

    <dynamic-filter-preview
      v-for="(filter) of appliedFilters"
      :key="filter.name"
      :filter="filter"
      @delete:filter="deleteAppliedFilter($event.name)"
    >
      <template #form>
        <dynamic-filter-config-form
          :filter="filter"
          @submit="updateAppliedFilter"
        >
          <template #value-input="{ filterName, filterValue, onValueChange, onValueInvalidChange }">
            <component
              :is="getFilterValueComponent(filterName)"
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
          :is="getPreviewComponent(filter.name)"
          :value="filter.value"
        >
        </component>
      </template>
    </dynamic-filter-preview>
  </section>
</template>

<script lang="ts" setup>
import {computed, type Ref} from 'vue';
import {storeToRefs} from 'pinia';
import DynamicFilterPreview
  from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/preview/dynamic-filter-preview.vue';
import DynamicFilterAddAction
  from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-add-action.vue';
import {FilterName} from '@webitel/ui-sdk/src/modules/Filters/v2/filters/types/Filter.d.ts';
import DynamicFilterConfigForm
  from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/config/dynamic-filter-config-form.vue';
import {useTableStore} from '../store/cases.store.ts';

const emit = defineEmits<{
  hide: [],
}>();

const tableStore = useTableStore();
const {filtersManager} = storeToRefs(tableStore);
window.fmanager = filtersManager;

const {
  addFilter: applyFilter,
  updateFilter: updateAppliedFilter,
  deleteFilter: deleteAppliedFilter,
} = tableStore;

const appliedFilters = computed(() => {
  const exclude = Object.values(SearchMode);
  return filtersManager.value.getFiltersList({exclude});
});

const unappliedFilters: Ref<Array<{ name: string, value: FilterName }>> = computed(() => {

  const filterOptions = [
    {
      id: 'agent',
      name: 'Agent title',
    },
  ];

  return filterOptions;
});

const getFilterValueComponent = (filterName: FilterName) => {
  switch (filterName) {
    case 'agent':
      return AgentFilter;
    default:
  }
};

const getPreviewComponent = (filterName: FilterName) => {
  switch (filterName) {
    case 'agent':
      return AgentFilterPreview;
    default:
  }
};
</script>
