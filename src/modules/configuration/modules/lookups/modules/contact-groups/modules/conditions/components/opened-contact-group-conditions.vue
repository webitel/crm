<template>
  <section class="table-page opened-sla-conditions">
    <condition-popup
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
        {{ t('lookups.slas.conditions', 2) }}
      </h3>

      <wt-action-bar
        :include="[IconAction.ADD, IconAction.REFRESH]"
        @click:add="router.push({ ...route, params: { conditionId: 'new' } })"
        @click:refresh="loadData"
      >
      </wt-action-bar>
    </header>

    <wt-loader v-show="isLoading" />

    <div
      class="table-section__table-wrapper"
    >

      <wt-empty
        v-show="showEmpty"
        :image="imageEmpty"
        :text="textEmpty"
      />

      <wt-table-transition v-if="dataList.length && !isLoading">
        <wt-table
          :data="dataList"
          :headers="headers"
          :selected="selected"
          sortable
          @sort="sort"
          @update:selected="setSelected"
        >
          <template #expression="{ item }">
            {{ item.expression }}
          </template>
          <template #group="{ item }">
            {{ item.group.name }}
          </template>
          <template #assignee="{ item }">
            {{ item.assignee.name }}
          </template>
          <template #actions="{ item }">
            <wt-tooltip>
              <template #activator>
                <wt-icon-btn
                  icon="move"
                />
              </template>
              {{ t('iconHints.draggable') }}
            </wt-tooltip>
            <wt-icon-action
              action="edit"
              @click="router.push({ ...route, params: { conditionId: item.id } })"
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
      </wt-table-transition>
      <filter-pagination
        :namespace="filtersNamespace"
        :next="isNext"
      />
    </div>
  </section>
</template>

<script setup>
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useCardStore, useTableStore } from '@webitel/ui-sdk/store';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import ConditionPopup from './opened-contact-group-conditions-popup.vue';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import filters from '../modules/filters/store/filters.js';
import WtTableTransition from '@webitel/ui-sdk/src/components/on-demand/wt-table-transition/wt-table-transition.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const {
  namespace: parentCardNamespace,
  id: parentId,
} = useCardStore(props.namespace);

const namespace = `${parentCardNamespace}/conditions`;

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
  sort,
  setSelected,
  onFilterEvent,
} = useTableStore(namespace);

const {
  namespace: filtersNamespace,
  restoreFilters,
  subscribe,
  flushSubscribers,
} = useTableFilters(tableNamespace);

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
});

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
} = useTableEmpty({ dataList, filters, error, isLoading });
</script>

<style lang="scss" scoped>
.opened-sla-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
