<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        hidePrimary
        :secondary-action="goBack"
        :secondary-text="t('close')"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <delete-confirmation-popup
        :shown="isDeleteConfirmationPopup"
        :callback="deleteCallback"
        :delete-count="deleteCount"
        @close="closeDelete" />
      <section class="main-section__wrapper">
        <header class="main-section-header">
          <h3 class="content-title">
            {{ t('lookups.sources.caseSources') }}
          </h3>
          <div class="main-section-header__actions-wrap">
            <filter-search
              :namespace="filtersNamespace"
              name="name"
            />
            <wt-icon-action
              :disabled="!hasObacEditAccess"
              action="add"
              @click="create"
              class="add" />
            <wt-icon-action
              action="refresh"
              @click="loadData"
            />
            <delete-all-action
              class="delete"
              v-if="hasObacDeleteAccess"
              :disabled="anySelected"
              :selected-count="selectedRows.length"
              @click="askDeleteConfirmation({
                deleted: selectedRows,
                callback: () => deleteData(selectedRows),
              })"
            />
          </div>
        </header>

        <wt-loader v-show="isLoading" />

        <wt-dummy
          class="dummy-wrapper"
          v-if="!isLoading && !dataList.length"
          :show-action="dummy.showAction"
          :text="dummy.text && t(dummy.text)"
          :dark-mode="darkMode"
          @create="create"
        />

        <div class="table-wrapper" v-show="dataList.length">
          <wt-table
            :data="dataList"
            :headers="headers"
            sortable
            @sort="sort"
          >
            <template #name="{ item }">
              <wt-item-link :link="'/lookups/sources/' + item.id + '/general'">
                {{ item.name }}
              </wt-item-link>
            </template>
            <template #actions="{ item }">
              <wt-item-link :link="'/lookups/sources/' + item.id + '/general'">
                <wt-icon-action action="edit" />
              </wt-item-link>
              <wt-icon-action
                class="table-action"
                v-if="hasObacDeleteAccess"
                action="delete"
                @click="askDeleteConfirmation({
                deleted: [item],
                callback: () => deleteData(item),
              })"
              />
            </template>
          </wt-table>
          <filter-pagination :namespace="filtersNamespace" :is-next="isNext" />
        </div>
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import CrmSections from "@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum";
import DeleteConfirmationPopup from "@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue";
import { useDeleteConfirmationPopup } from "@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup";
import FilterPagination from "@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue";
import FilterSearch from "@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue";
import { useTableFilters } from "@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters";
import { useTableStore } from "@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore";
import isEmpty from "@webitel/ui-sdk/src/scripts/isEmpty";
import variableSearchValidator from "@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator";
import { useCardStore } from "@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore";

import { computed, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import dummyDark from "../../../../../../../app/assets/dummy-dark.svg";
import dummyLight from "../../../../../../../app/assets/dummy-light.svg";
import { useAccess } from "../../../../../../../app/composables/useAccess";
import RouteNames from "../../../../../../../app/router/_internals/RouteNames.enum";

const baseNamespace = "sources";

const { t } = useI18n();
const router = useRouter();
const store = useStore();

const { hasObacCreateAccess, hasObacEditAccess, hasObacDeleteAccess } =
  useAccess();

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const {
  namespace,
  dataList,
  selected,
  isLoading,
  headers,
  isNext,
  error,
  loadData,
  deleteData,
  sort,
  setSelected,
  onFilterEvent,
} = useTableStore(baseNamespace);

const {
  namespace: filtersNamespace,
  restoreFilters,
  subscribe,
  flushSubscribers,
} = useTableFilters(namespace);

const {
  setId,
  resetState,
  deleteItem
} = useCardStore(baseNamespace);

subscribe({
  event: "*",
  callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
});

const routeName = ref(`${RouteNames.SOURCES}`);
const isContactPopup = ref(false);
const editedContactId = ref(null);

const path = computed(() => [
  {
    name: t("crm"),
    route: "/start-page",
  },
  {
    name: t("lookups.contactGroups.configurations"),
    route: "/configuration",
  },
  {
    name: t("lookups.lookups"),
  },
  {
    name: t("lookups.sources.caseSources"),
    route: "/lookups/sources",
  },
]);

const darkMode = computed(() => store.getters["appearance/DARK_MODE"]);
const dummyPic = computed(() => (darkMode.value ? dummyDark : dummyLight));

const anySelected = computed(() => {
  return !selectedRows.value.length;
});
const selectedRows = computed(() => {
  return dataList.value.filter((item) => item._isSelected);
});

const deletableSelectedItems = computed(() =>
  selected.value.filter((item) => item.access.delete),
);

function create() {
  resetState();
  router.push({ name: `${routeName.value}-card`, params: { id: "new" } });
}

function edit({ id }) {
  editedContactId.value = id;
  isContactPopup.value = true;
}

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: deletableSelectedItems.value,
    callback: () => deleteData([...deletableSelectedItems.value]),
  });
}
function goBack() {
  router.push({ name: "configuration" });
}

// we need to check if there's any filters which actually filter data before showing "no data" dummy
// [WTEL-3776]
// display different images when no contacts have been created yet (default img)
// and when the filter didn't produce results
const dummy = computed(() => {
  if (dataList.value.length) return false;
  const filters = store.getters[`${filtersNamespace}/_STATE_FILTER_NAMES`];
  const defaultFilters = ["page", "size", "sort", "fields"];
  const dynamicFilters = Object.keys(filters).reduce((dynamic, filter) => {
    if (defaultFilters.includes(filter)) return dynamic;
    return {
      ...dynamic,
      [filter]: filters[filter],
    };
  }, {});
  const isEmptyFilters = isEmpty(dynamicFilters);

  return {
    src: isEmptyFilters ? "" : dummyPic.value,
    text: isEmptyFilters ? "" : t("vocabulary.emptyResultSearch"),
  };
});

onUnmounted(() => {
  resetState();
});
</script>

<style lang="scss" scoped>
.content-title {
  @extend %typo-heading-4;
}

.main-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xs) var(--spacing-xs) 0;

  &__actions-wrap {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);

    :deep(.wt-tooltip) {
      order: 2;

      &.add {
        order: 1;
      }
    }

    .delete {
      order: 3;
    }

    :deep(.wt-table-actions) {
      padding: 0;
    }
  }
}
</style>
