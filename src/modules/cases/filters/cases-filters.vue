<template>
  <dynamic-filter-panel-wrapper>
    <template #filters>
<!--      WTF? -- https://webitel.atlassian.net/browse/WTEL-6308?focusedCommentId=657415 -->
      <dynamic-filter-preview
        v-if="!hasCreatedAtFromFilter"
        :filter="defaultCreatedAtFromFilterDataPreview"
        dummy
      >
        <template #info>
          <component
            :is="filtersConfig['createdAtFrom'].previewField"
            :value="defaultCreatedAtFromFilterDataPreview.value"
          />
        </template>
      </dynamic-filter-preview>

      <dynamic-filter-preview
        v-for="filter of appliedFilters"
        :key="filter.name"
        :filter="filter"
        @delete:filter="deleteAppliedFilter($event.name)"
      >
        <template #form="{ hide }">
          <dynamic-filter-config-form
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
import DynamicFilterConfigForm from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/config/dynamic-filter-config-form.vue';
import DynamicFilterAddAction from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-add-action.vue';
import DynamicFilterPanelWrapper from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-panel-wrapper.vue';
import DynamicFilterPreview from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/preview/dynamic-filter-preview.vue';
import type {
  FilterInitParams,
  FilterName,
  IFilter,
} from '@webitel/ui-sdk/src/modules/Filters/v2/filters/types/Filter.d.ts';
import { startOfToday } from 'date-fns';
import { storeToRefs } from 'pinia';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCasesStore } from '../stores/cases';
import { filtersConfig } from './filters-config';
import { SearchMode } from './SearchMode';

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

/* WTF? -- https://webitel.atlassian.net/browse/WTEL-6308?focusedCommentId=657415 */
const defaultCreatedAtFromFilterDataPreview = computed(() => ({
  name: 'createdAtFrom',
  value: startOfToday().getTime(),
  label: t('webitelUI.filters.predefinedLabels.createdAt.startOfToday'),
}));

const hasCreatedAtFromFilter = computed(() => {
  return !!filtersManager.value.getAllValues().createdAtFrom;
});

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

    return Object.keys(filtersConfig)
      .filter((key) => !excludeNames.has(key))
      .map((key) => ({
        name: t(`webitelUI.filters.${key}`),
        value: key,
      }));
  });

const resetFilters = () => {
  filtersManager.value.reset();
};

const getFilterFieldComponent = (
  filterName: FilterName,
  filterField: 'valueField' | 'previewField',
) => {
  const filter = filtersConfig[filterName];
  return !filter ? '' : filter[filterField] || '';
};
</script>
