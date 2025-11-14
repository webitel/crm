<template>
  <section class="table-page opened-close-reasons">
    <opened-close-reasons-popup
      :namespace="namespace"
      @load-data="loadData"
    />
    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :delete-count="deleteCount"
      :callback="deleteCallback"
      @close="closeDelete"
    />
    <header class="table-title">
      <h3 class="table-title__title">
        {{ t('lookups.closeReasonGroups.reason', 2) }}
      </h3>

      <wt-action-bar
        :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
        :disabled:delete="!hasDeleteAccess || !selected.length"
        :disabled:add="!hasCreateAccess"
        @click:add="add"
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
      </wt-action-bar>
    </header>

    <div class="table-section__table-wrapper">

      <wt-empty
        v-show="showEmpty"
        :image="imageEmpty"
        :text="textEmpty"
        :primary-action-text="primaryActionTextEmpty"
        :disabled-primary-action="!hasCreateAccess"
        @click:primary="add"
      />

      <wt-loader v-show="isLoading" />

      <wt-table
        v-show="dataList.length && !isLoading"
        :data="dataList"
        :headers="headers"
        :selected="selected"
        sortable
        @sort="sort"
        @update:selected="setSelected"
      >
        <template #name="{ item }">
          {{ item.name }}
        </template>
        <template #description="{ item }">
          {{ item.description }}
        </template>
        <template #actions="{ item }">
          <wt-icon-action
            :disabled="!hasUpdateAccess"
            action="edit"
            @click="router.push({ ...route, params: { closeReasonsId: item.id } })"
          />
          <wt-icon-action
            action="delete"
            :disabled="!hasDeleteAccess"
            @click="askDeleteConfirmation({
              deleted: [item],
              callback: () => deleteData(item),
            })"
          />
        </template>
      </wt-table>
      <filter-pagination
        :namespace="filtersNamespace"
        :next="isNext"
      />
    </div>
  </section>
</template>

<script setup>
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import OpenedCloseReasonsPopup from './opened-close-reasons-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

const {
  namespace: parentCardNamespace,
  id: parentId,
} = useCardStore(props.namespace);

const namespace = `${parentCardNamespace}/closeReasons`;

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const {
  namespace: tableNamespace,

  dataList,
  selected,
  isLoading,
  headers,
  isNext,
  error,

  loadData,
  deleteData,
  setSelected,
  onFilterEvent,
  sort,
} = useTableStore(namespace);

const {
  namespace: filtersNamespace,
  restoreFilters,
  filtersValue,
  resetFilters,

  subscribe,
  flushSubscribers,
} = useTableFilters(tableNamespace);

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({ dataList, filters: filtersValue, error, isLoading });

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
  resetFilters();
});

const add = () => {
  return router.push({ ...route, params: { closeReasonsId: 'new' } });
};

</script>

<style lang="scss" scoped>
</style>
