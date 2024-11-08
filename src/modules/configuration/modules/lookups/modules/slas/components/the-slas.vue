<template>
  <wt-page-wrapper
    :actions-panel="false"
    class="slas"
  >
    <template #header>
      <wt-page-header
        hide-primary
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <header class="content-header">
        <h3 class="content-title">
          {{ t('lookups.slas.slas') }}
        </h3>
        <wt-actions-bar
          mode="table"
          :actions="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
          @click:add="router.push({ name: `${CrmSections.SLAS}-card`, params: { id: 'new' }})"
        >
          <template #search-bar>
            <filter-search
              :namespace="filtersNamespace"
              name="search"
            />
          </template>
        </wt-actions-bar>
      </header>


      <wt-loader v-show="isLoading" />

      <delete-confirmation-popup
        :shown="isDeleteConfirmationPopup"
        :callback="deleteCallback"
        :delete-count="deleteCount"
        @close="closeDelete"
      />

      <div
        v-show="!isLoading && dataList.length"
        class="table-wrapper"
      >
        <wt-table
          :data="dataList"
          :headers="headers"
          :selected="selected"
          sortable
          @sort="sort"
          @update:selected="setSelected"
        >
          <template #name="{ item }">
            <wt-item-link
              :link="{ name: `${CrmSections.SLAS}-card`, params: { id: item.id } }">
              {{ item.name }}
            </wt-item-link>
          </template>
          <template #description="{ item }">
            {{ item.description }}
          </template>
          <template #calendar="{ item }">
            {{ item.calendar.name }}
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
          :namespace="filtersNamespace"
          :is-next="isNext"
        />
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import WtActionsBar from '@webitel/ui-sdk/src/components/wt-action-bar/wt-action-bar.vue';
import WtEmpty from '@webitel/ui-sdk/src/components/wt-empty/wt-empty.vue';

import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const baseNamespace = 'configuration/lookups/slas';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

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
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.slas.slas', 2), route: '/slas' },
]);

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const deletableSelectedItems = computed(() => (
  selected.value.filter((item) => item.access.delete)
));

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: deletableSelectedItems.value,
    callback: () => deleteData([...deletableSelectedItems.value]),
  });
}

const { close } = useClose('configuration');

function edit(item) {
  return router.push({
    name: `${CrmSections.SLAS}-card`,
    params: { id: item.id },
  });
}
</script>

<style lang="scss" scoped>
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
</style>
