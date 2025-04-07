<template>
  <section class="cases-table-section table-section">
    <header class="table-title">
      <h3 class="table-title__title">
        {{ $t('cases.case', 2) }}
      </h3>

      <wt-action-bar
        v-bind="props.actionBarProps"
      >
        <template #search-bar>
          <dynamic-filter-search-wrapper class="cases__search-filter" />
        </template>
        <template #filters="{ action, onClick }">
          <wt-badge :hidden="!anyFiltersOnFiltersPanel">
            <wt-icon-action
              :action="action"
              @click="onClick"
            />
          </wt-badge>
        </template>
        <template #columns>
          <wt-table-column-select
            :headers="headers"
            @change="updateShownHeaders"
          />
        </template>
      </wt-action-bar>
    </header>
    <wt-loader v-show="isLoading" />

    <wt-empty
      v-if="showEmpty"
      v-bind="emptyProps"
    />

    <div
      v-show="!isLoading && dataList?.length"
      class="table-section__table-wrapper"
    >
      <wt-table
        :data="dataList"
        :headers="shownHeaders"
        :selected="selected"
        sortable
        v-bind="tableProps"
        @sort="updateSort"
        @update:selected="updateSelected"
      >
        <template #name="{ item }">
          <wt-item-link
            :link="{
                  name: `${CrmSections.CASES}-card`,
                  params: { id: item?.id },
                }"
          >
            <div class="cases__link-content">
              <color-component-wrapper
                :color="item.priority?.color"
                component="wt-icon"
                icon="cases"
                size="md"
              />

              {{ item.name }}
            </div>
          </wt-item-link>
        </template>
        <template #subject="{ item }">
          <wt-item-link
            :link="{
                  name: `${CrmSections.CASES}-card`,
                  params: { id: item?.id },
                }"
          >
            {{ item.subject }}
          </wt-item-link>
        </template>
        <template #priority="{ item }">
          <color-component-wrapper
            :class="{ 'case-priority': !!item.priority?.color }"
            :color="item.priority?.color"
          >
            {{ item.priority?.name }}
          </color-component-wrapper>
        </template>
        <template #statusCondition="{ item }">
          {{ item.statusCondition?.name }}
        </template>
        <template #source="{ item }">
          <wt-icon
            color="info"
            :icon="item?.source?.type"
          />
        </template>
        <template #createdAt="{ item }">
          {{ prettifyDate(item.createdAt) }}
        </template>
        <template #service="{ item }">
          {{ item.service?.name }}
        </template>
        <template #createdBy="{ item }">
          {{ item.createdBy?.name }}
        </template>
        <template #group="{ item }">
          {{ item.group?.name }}
        </template>
        <template #assignee="{ item }">
          {{ item.assignee?.name }}
        </template>
        <template #reporter="{ item }">
          {{ item.reporter?.name }}
        </template>
        <template #impacted="{ item }">
          {{ item.impacted?.name }}
        </template>
        <template #appliedSLA="{ item }">
          {{ item.sla?.name }}
        </template>
        <template #slaCondition="{ item }">
          {{ item.slaCondition?.name }}
        </template>
        <template #plannedReactionAt="{ item }">
          {{ prettifyDate(item.plannedReactionAt) }}
        </template>
        <template #plannedResolveAt="{ item }">
          {{ prettifyDate(item.plannedResolveAt) }}
        </template>
        <template #actualReactionTime="{ item }">
          {{ prettifyDate(item.reactedAt) }}
        </template>
        <template #actualResolutionTime="{ item }">
          {{ prettifyDate(item.resolvedAt) }}
        </template>
        <template #closeReason="{ item }">
          {{ item.closeReason?.name }}
        </template>
        <template #closeResult="{ item }">
          {{ item.closeResult }}
        </template>
        <template #rating="{ item }">
          {{ item.rating }}
        </template>
        <template #actions="{ item }">
          <slot
            name="table:actions"
            v-bind="{ item }"
          />
        </template>
      </wt-table>

      <wt-pagination
        :next="next"
        :prev="page > 1"
        :size="size"
        debounce
        @change="updateSize"
        @next="updatePage(page + 1)"
        @prev="updatePage(page - 1)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import {CrmSections} from "@webitel/ui-sdk/enums";
import {
  useTableEmpty
} from "@webitel/ui-sdk/modules/TableComponentModule/composables/useTableEmpty";
import deepmerge from "deepmerge";
import {type StoreDefinition, storeToRefs} from 'pinia';
import {computed} from "vue";

import ColorComponentWrapper from "../../../../../app/components/utils/color-component-wrapper.vue";
import DynamicFilterSearchWrapper
  from "../../../../cases/filters/components/dynamic-filter-search-wrapper.vue";
import {SearchMode} from "../../../../cases/filters/SearchMode";
import prettifyDate from "../../../../cases/utils/prettifyDate";

type Props = {
  useTableStore: StoreDefinition,
  tableProps: {
    selectable?: boolean;
  },
  emptyProps: {
    primaryActionText?: string | boolean;
  },
};

const props = defineProps<Props>();

// const emit = defineEmits<{
// }>();

const tableProps = computed(() => {
  const defaultTableProps = {
    selectable: true,
  };

  return deepmerge.all([
    ...defaultTableProps,
    ...props.tableProps,
  ]);
});

const tableStore = props.useTableStore();

const {
  dataList,
  selected,
  error,
  isLoading,
  page,
  size,
  next,
  headers,
  shownHeaders,
  filtersManager,
} = storeToRefs(tableStore);

const {
  initialize,
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
  updateShownHeaders,
} = tableStore;

// initialize();

const defaultEmptyProps = useTableEmpty({
  dataList,
  error,
  filters: computed(() => filtersManager.value.getAllValues()),
  isLoading,
});

const emptyProps = computed(() => {
  return deepmerge.all([
    ...defaultEmptyProps,
    ...props.emptyProps,
  ]);
});

/*
 * show "toggle filters panel" badge if any filters are applied...
 * */
const anyFiltersOnFiltersPanel = computed(() => {
  /*
   * ...excluding search filters, which shown in other panel
   * */
  return filtersManager.value.getAllKeys().some((filterName) => {
    return !Object.values(SearchMode).some((mode) => mode === filterName);
  });
});
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.table-title {
  grid-gap: var(--spacing-xs);
}

.cases__link-content {
  display: flex;
  gap: var(--spacing-xs);
}

.cases__search-filter {
  margin-left: auto;
}

//TODO: typo-body-1 bold
.case-priority {
  @extend %typo-body-1;
  font-weight: bold;
}
</style>
