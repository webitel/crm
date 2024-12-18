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
        :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
        :disabled:delete="!selected.length"
        @click:add="router.push({ ...route, params: { conditionId: 'new' } })"
        @click:refresh="refresh"
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

    <div
      class="table-section__table-wrapper"
    >

      <wt-empty
        v-show="showEmpty"
        :image="imageEmpty"
        :text="textEmpty"
      />

      <wt-loader v-show="isLoading" />

      <div v-if="dataList.length && !isLoading">
        <wt-table
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
          <template #priorities="{ item }">
            <div
              v-if="item.priorities?.length"
              class="opened-sla-conditions__priorities"
            >
              <p>{{ item.priorities[0]?.name }}</p>
              <wt-tooltip
                v-if="item.priorities?.length > 1"
                :triggers="['click']"
              >
                <template #activator>
                  <wt-chip>
                    +{{ item.priorities?.length - 1 }}
                  </wt-chip>
                </template>

                <ul>
                  <li
                    v-for="({ id, name }) of item.priorities?.slice(1)"
                    :key="id"
                  >
                    <p>{{ name }}</p>
                  </li>
                </ul>
              </wt-tooltip>
            </div>
          </template>
          <template #reactionTime="{ item }">
            {{ convertDurationWithMinutes(item.reactionTime / 60) }}
          </template>
          <template #resolutionTime="{ item }">
            {{ convertDurationWithMinutes(item.resolutionTime / 60) }}
          </template>
          <template #actions="{ item }">
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
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import FilterSearch
  from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import ConditionPopup from './opened-sla-condition-popup.vue';
import convertDurationWithMinutes from '@webitel/ui-sdk/src/scripts/convertDurationWithMinutes.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import filters from '../modules/filters/store/filters.js';

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
  resetState,
} = useTableStore(namespace);

const {
  namespace: filtersNamespace,
  filtersValue,
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
  resetState();
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
</script>

<style lang="scss" scoped>
.opened-sla-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
