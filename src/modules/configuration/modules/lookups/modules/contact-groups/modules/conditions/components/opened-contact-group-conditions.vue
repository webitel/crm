<template>
  <section class="table-page opened-contact-group-conditions">
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
        @click:refresh="refresh"
      >
      </wt-action-bar>
    </header>

    <wt-loader v-show="isLoading" />

    <div class="table-section__table-wrapper">

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
            <wt-icon-btn
              icon="move"
            />
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
import { onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Sortable, { Swap } from 'sortablejs';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import ConditionPopup from './opened-contact-group-conditions-popup.vue';
import ConditionsAPI from '../api/conditions.js';

const sortableConfig = {
  swap: true, // Enable swap mode
  swapClass: 'sortable-swap-highlight', // Class name for swap item (if swap mode is enabled)
  animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
  easing: 'cubic-bezier(1, 0, 0, 1)', // Easing for animation. Defaults to null. See https://easings.net/ for examples.
};

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
  setSelected,
  onFilterEvent,
  resetState,
} = useTableStore(namespace);

const {
  namespace: filtersNamespace,
  restoreFilters,
  subscribe,
  filtersValue,
  flushSubscribers,
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
} = useTableEmpty({ dataList, undefined, error, isLoading });

onUnmounted(() => {
  flushSubscribers();
});

const refresh = () => {
  // https://webitel.atlassian.net/browse/WTEL-5711
  // because 'selected' value needs cleaned
  resetState();
  loadData();
};

watch(() => filtersValue.value, () => {
  // https://webitel.atlassian.net/browse/WTEL-5744
  // because 'selected' value needs cleaned when changing filters
  resetState();
});

// https://webitel.atlassian.net/browse/WTEL-4740

function setPosition(newIndex, list) {
  if (newIndex === 0) return {
    currentPosition: dataList.value[0].id,
    targetPosition: 0,
  };

  if (newIndex === list.length - 1) return {
    currentPosition: 0,
    targetPosition: dataList.value[dataList.value.length - 1].id,
  };

  return {
    currentPosition: list[newIndex - 1].id,
    targetPosition: list[newIndex + 1].id,
  };
}

function initSortable(wrapper) {
  new Sortable(wrapper, {

    ...sortableConfig,

    async onEnd({ oldIndex, newIndex }) {
      const updatedDataList = [...dataList.value];

      const [movedItem] = updatedDataList.splice(oldIndex, 1);
      updatedDataList.splice(newIndex, 0, movedItem);

      await ConditionsAPI.patch({
        parentId: dataList.value[oldIndex].id,
        changes: {
          position: setPosition(newIndex, updatedDataList),
        },
      });
      await loadData();
    },
  });
}

function callSortable() {
  setTimeout(() => {
    const wrapper = document.querySelector('.wt-table__body');
    if (wrapper) {
      initSortable(wrapper);
    }
  }, 500);
}

watch(dataList, () => callSortable());
onMounted(async () => {
  if (!Sortable.__pluginsMounted) {
    Sortable.mount(new Swap());
    Sortable.__pluginsMounted = true;
  }

  callSortable();
});
</script>

<style lang="scss" scoped>
.opened-contact-group-conditions {
  :deep(.wt-table .sortable-swap-highlight) {
    background: var(--primary-color);
  }
}
</style>
