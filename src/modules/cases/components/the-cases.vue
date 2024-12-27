<template>
  <wt-page-wrapper
    class="cases table-page"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
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
            :include="[IconAction.ADD, IconAction.REFRESH]"
            @click:add="add"
          >
            <wt-icon-btn
              icon="filter"
            />
            <wt-icon-btn
              icon="column-select"
            />
            <wt-icon-btn
              v-if="selected.length"
              class="icon-action"
              icon="bucket"
              @click="deleteSelectedItems"
            />
            <template #search-bar>
              <wt-search-bar/>
            </template>
          </wt-action-bar>
        </header>
        <wt-loader v-show="isLoading" />
        <div
          v-show="!isLoading && dataList.length"
          class="table-section__table-wrapper"
        >
          <wt-table
            :data="dataList"
            :headers="headers"
            :selected="selected"
            sortable
            @sort="sort"
            @update:selected="setSelected"
          >
            <!--TODO: replace item.id with item.name when it will be available from API-->
            <template #id="{ item }">
              <wt-item-link
                :link="{ name: `${CrmSections.CASES}-card`, params: { id: item.id } }"
              >
                {{ item.id }}
              </wt-item-link>
            </template>
            <template #priority="{ item }">
              {{ item.priority?.name }}
            </template>
            <template #status="{ item }">
              {{ item.status?.name }}
            </template>
            <template #source="{ item }">
              {{ item.source?.name }}
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
            <template #appliedCondition="{ item }">
              {{ item.slaCondition?.name }}
            </template>
            <template #actualReactionTime="{ item }">
              {{ item.timing?.reactedAt }}
            </template>
            <template #actualResolutionTime="{ item }">
              {{ item.timing?.resolvedAt }}
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
                action="edit"
                @click="edit(item)"
              />
              <wt-icon-action
                action="delete"
                @click="askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
                })"
              />
            </template>
          </wt-table>
          <filter-pagination
            :is-next="isNext"
            :namespace="filtersNamespace"
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
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { computed, onUnmounted, } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const baseNamespace = 'cases';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const store = useStore();

const { close } = useClose('the-start-page');

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

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
});

const path = computed(() => [
  { name: t('crm') },
  {
    name: t('cases.case', 2),
    route: '/',
  },
]);

function add() {
  return router.push({
    name: `${CrmSections.CASES}-card`,
    params: { id: 'new' },
  });
}

function edit(item) {
  store.dispatch(`${baseNamespace}/card/TOGGLE_EDIT_MODE`, true);
  return router.push({
    name: `${CrmSections.CASES}-card`,
    params: { id: item.id },
  });
}

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: selected.value,
    callback: () => deleteData([...selected.value]),
  });
}

</script>

<style lang="scss" scoped>
</style>
