<template>
  <div class="contact-cases">
    <header v-if="showActionsPanel">

      <cases-filters-panel
        :namespace="ContactCasesNamespace"
        :table-store="tableStore"
        :presets-store="useContactCaseFilterPresetsStore"
        @hide="showActionsPanel = false"
      />
    </header>
    <header class="contact-cases-header">
      <h3 class="contact-cases-header__title">
        {{ $t('cases.case', 2) }}
      </h3>

      <cases-filter-search-bar
        :table-store="tableStore"
        class="contact-cases__search-filter" />

      <wt-action-bar
        :include="[
              IconAction.REFRESH,
              IconAction.FILTERS,
              IconAction.COLUMNS,
            ]"
        @click:refresh="loadDataList"
        @click:filters="showActionsPanel = !showActionsPanel"
      >
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
      :image="emptyImage"
      :headline="emptyHeadline"
      :title="emptyTitle"
      :text="emptyText"
    />

    <div
      v-show="!isLoading && dataList?.length"
      class="table-wrapper"
    >
      <wt-table
        :data="dataList"
        :headers="shownHeaders"
        :selectable="false"
        :grid-actions="false"
        sortable
        @sort="updateSort"
      >
        <template #name="{ item }">
          <a
            target="_blank"
            :href="contactCase(item.id)"
            :class="{ 'contact-cases__link_disabled' : isReadOnly }"
            class="contact-cases__link"
          >
            <div class="contact-cases__link-content">
              <color-component-wrapper
                :color="item.priority?.color"
                component="wt-icon"
                icon="cases"
                size="md"
              />

              {{ item.name }}
            </div>
          </a>
        </template>
        <template #subject="{ item }">
          <a
            target="_blank"
            :href="contactCase(item.id)"
            :class="{ 'contact-cases__link_disabled' : isReadOnly }"
            class="contact-cases__link"
          >
            {{ item.subject }}
          </a>
        </template>
        <template #priority="{ item }">
          <color-component-wrapper
            :class="{ 'contact-cases__priority': !!item.priority?.color }"
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


  </div>
</template>

<script lang="ts" setup>
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import {
  useTableEmpty,
} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, inject, ref } from 'vue';
import { useStore } from 'vuex';

import ColorComponentWrapper from '../../../../../app/components/utils/color-component-wrapper.vue';
import CasesFilterSearchBar
  from '../../../../cases/components/cases-filter-search-bar.vue';
import CasesFiltersPanel from '../../../../cases/components/cases-filters-panel.vue';
import { SearchMode } from '../../../../cases/enums/SearchMode';
import prettifyDate from '../../../../cases/utils/prettifyDate.js';
import { ContactCasesNamespace } from '../namespace';
import { useContactCasesStore } from '../stores/cases';
import { useContactCaseFilterPresetsStore } from '../stores/useContactCaseFilterPresetsStore';

const isReadOnly = inject('isReadOnly');
const store = useStore();

const tableStore = useContactCasesStore();

const showActionsPanel = ref(true);

const {
  dataList,
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
  loadDataList,
  updatePage,
  updateSize,
  updateSort,
  updateShownHeaders,
} = tableStore;

const {
  showEmpty,
  image: emptyImage,
  headline: emptyHeadline,
  title: emptyTitle,
  text: emptyText,
} = useTableEmpty({
  dataList,
  error,
  filters: computed(() => filtersManager.value.getAllValues()),
  isLoading,
});

const parentId = computed(() => store.state.contacts.card.itemId);

initialize({ parentId: parentId.value });

const contactCase = (id: string) => `${import.meta.env.VITE_CRM_URL}/cases/${id}`;

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

<style lang="scss" scoped>

@use '@webitel/ui-sdk/src/css/main' as *;

.contact-cases {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  &-header {
    display: flex;
    gap: var(--spacing-xs);
    justify-content: space-between;
    align-items: center;
  }

  &-header__title {
    @extend %typo-heading-3;
  }

  &__search-filter {
    margin-left: auto;
  }

  &__link {
    color: var(--text-main-color);

    &_disabled {
      pointer-events: none;
      color: var(--text-main-color);
    }
  }

  &__link-content {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__priority {
    @extend %typo-body-1;
    font-weight: bold;
  }
}
</style>
