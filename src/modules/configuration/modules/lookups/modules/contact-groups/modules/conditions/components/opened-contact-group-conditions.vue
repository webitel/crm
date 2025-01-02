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

      <div v-if="dataList.length && !isLoading">
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
      </div>
      <filter-pagination
        :namespace="filtersNamespace"
        :next="isNext"
      />
    </div>
  </section>
</template>

<script setup>
import { moveArrayElement } from '@vueuse/integrations/useSortable';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useCardStore, useTableStore } from '@webitel/ui-sdk/store';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import ConditionPopup from './opened-contact-group-conditions-popup.vue';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useDestroyableSortable } from '@webitel/ui-sdk/src/composables/useDestroyableSortable/useDestroyableSortable';
import ConditionsAPI from '../api/conditions.js';

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
  filtersValue,
} = useTableFilters(tableNamespace);

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();

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
} = useTableEmpty({ dataList, error, isLoading });

const SortableWrapper = ref(null);
const page = computed(() => filtersValue.value.page);

const { initSortable, destroySortable, reloadSortable } = useDestroyableSortable(SortableWrapper, {
  onEnd: async ({ newIndex, oldIndex }) => {
    if (newIndex === oldIndex) return;
    await ConditionsAPI.patch({
      parentId: dataList.value[oldIndex].id,
      changes: {
        position: {
          currentPosition: (oldIndex) * page.value,
          targetPosition: (newIndex) * page.value,
        },
      },
    });
    await loadData();
    destroySortable();
    initSortable();
  },
});

onMounted (() => {
  setTimeout(() => {
    const element = document.querySelector('.wt-table__body');

    SortableWrapper.value = element;
    initSortable();
  }, 500);
});

onUnmounted(() => {
  flushSubscribers();
  destroySortable();
});

</script>

<style lang="scss" scoped>
.opened-sla-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
