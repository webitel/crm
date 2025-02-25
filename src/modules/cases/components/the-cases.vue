<template>
  <wt-page-wrapper
    class="cases table-page"
    :actions-panel="showActionsPanel"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #actions-panel>
      <cases-filters
        @hide="showActionsPanel = false"
      />
    </template>
    <template #main>
      <delete-confirmation-popup
        :callback="deleteCallback"
        :delete-count="deleteCount"
        :shown="isDeleteConfirmationPopup"
        @close="closeDelete"
      />

      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ $t('cases.case', 2) }}
          </h3>
          <wt-action-bar
            :include="[
              IconAction.ADD,
              IconAction.REFRESH,
               IconAction.FILTERS,
              /* IconAction.COLUMNS, */
              IconAction.DELETE,
            ]"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            :disabled:add="!hasCreateAccess"
            @click:add="add"
            @click:refresh="loadDataList"
            @click:delete="deleteSelectedItems"
            @click:filters="showActionsPanel = !showActionsPanel"
          >
            <template #filters="{ action, onClick }">
              <wt-badge
                :hidden="!anyFiltersOnFiltersPanel"
              >
                <wt-icon-action
                  :action="action"
                  @click="onClick"
                />
              </wt-badge>
            </template>
          </wt-action-bar>
        </header>
        <wt-loader v-show="isLoading" />
        <div
          v-show="!isLoading && dataList?.length"
          class="table-section__table-wrapper"
        >
          <wt-table
            :data="dataList"
            :headers="headers"
            :selected="selected"
            sortable
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
              <span
                :class="{ 'case-priority': !!item.priority?.color }"
                :style="{ color: item.priority?.color }"
              >
                {{ item.priority?.name }}
              </span>
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
              {{ prettifyDate(item.timing?.reactedAt) }}
            </template>
            <template #actualResolutionTime="{ item }">
              {{ prettifyDate(item.timing?.resolvedAt) }}
            </template>
            <template #closeReason="{ item }">
              {{ item.close?.closeReason?.name }}
            </template>
            <template #closeResult="{ item }">
              {{ item.close?.closeResult }}
            </template>
            <template #rate="{ item }">
              {{ item.rate?.rating }}
            </template>
            <template #actions="{ item }">
              <wt-icon-action
                :disabled="!hasUpdateAccess"
                action="edit"
                @click="edit(item)"
              />
              <wt-icon-action
                :disabled="!hasDeleteAccess"
                action="delete"
                @click="
                  askDeleteConfirmation({
                    deleted: [item],
                    callback: () => deleteEls(item),
                  })
                "
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
  </wt-page-wrapper>
</template>

<script setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import ColorComponentWrapper from '../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import CasesFilters from '../filters/cases-filters.vue';
import { SearchMode } from '../filters/SearchMode';
import { useCasesStore } from '../stores/cases.ts';
import prettifyDate from '../utils/prettifyDate.js';

const baseNamespace = 'cases';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl();

const { close } = useClose('the-start-page');

const tableStore = useCasesStore();

const { dataList, selected, isLoading, page, size, next, headers, filtersManager } =
  storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
  deleteEls,
} = tableStore;

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const showActionsPanel = ref(true);

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

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  {
    name: t('cases.case', 2),
  },
]);

function add() {
  return router.push({
    name: `${CrmSections.CASES}-card`,
    params: { id: 'new' },
  });
}

function edit(item) {
  /*
  at "edit", only(!) store state is used to determine read/edit mode
  because store is much reliable as the state source, comparing to url query
   */
  store.dispatch(`${baseNamespace}/card/TOGGLE_EDIT_MODE`, true);
  return router.push({
    name: `${CrmSections.CASES}-card`,
    params: { id: item.id },
  });
}

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: selected.value,
    callback: () => deleteEls([...selected.value]),
  });
}

initialize();
</script>

<style lang="scss" scoped>
.cases__link-content {
  display: flex;
  gap: var(--spacing-xs);
}

//TODO: typo-body-1 bold
.case-priority {
  @extend %typo-body-1;
  font-weight: bold;
}
</style>
