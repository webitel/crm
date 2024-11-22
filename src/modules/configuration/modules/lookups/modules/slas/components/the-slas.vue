<template>
  <wt-page-wrapper
    class="table-page slas"
    :actions-panel="false"
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
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('lookups.slas.slas') }}
          </h3>
          <wt-actions-bar
            mode="table"
            :actions="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            @click:add="router.push({ name: `${CrmSections.SLAS}-card`, params: { id: 'new' }})"
            @click:refresh="loadData"
            @click:delete="askDeleteConfirmation({
                  deleted: selected,
                  callback: () => deleteData(selected),
                })"
          >
            <template #search-bar>
              <filter-search
                :namespace="filtersNamespace"
                name="search"
              />
            </template>
          </wt-actions-bar>
        </header>
      </section>


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
              v-if="hasEditAccess"
              action="edit"
              @click="edit(item)"
            />
            <wt-icon-action
              v-if="hasDeleteAccess"
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
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';

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
import { computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const baseNamespace = 'configuration/lookups/slas';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

const { hasCreateAccess, hasEditAccess, hasDeleteAccess } = useAccessControl();

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

const { close } = useClose('configuration');

function edit(item) {
  return router.push({
    name: `${CrmSections.SLAS}-card`,
    params: { id: item.id },
  });
}
</script>

<style lang="scss" scoped>
</style>
