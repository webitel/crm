<template>
  <section class="table-page opened-status-conditions">
    <condition-popup
      :namespace="cardNamespace"
      @load-data="loadData"
    />

    <opened-status-condition-warning-popup
      :shown="isStatusWarningPopupOpened"
      @close="closeWarningPopup"
    />

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :delete-count="deleteCount"
      :callback="deleteCallback"
      @close="closeDelete"
    />

    <header class="table-title">
      <h3 class="table-title__title">
        {{ t('lookups.statuses.name', 2) }}
      </h3>

      <wt-action-bar
        :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
        :disabled:delete="!selected.length"
        @click:add="
          router.push({ ...route, params: { statusConditionId: 'new' } })
        "
        @click:refresh="loadData"
        @click:delete="
          askDeleteConfirmation({
            deleted: selected,
            callback: () => deleteData(selected),
          })
        "
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

          <template #description="{ item }">
            {{ item.description }}
          </template>

          <template #initial="{ item, index }">
            <wt-switcher
              :value="item.initial"
              @change="
                changeInitialStatus({ index, prop: 'initial', value: $event })
              "
            />
          </template>

          <template #final="{ item, index }">
            <wt-switcher
              :value="item.final"
              @change="changeProperty({ index, prop: 'final', value: $event })"
            />
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              action="edit"
              @click="
                router.push({
                  ...route,
                  params: { statusConditionId: item.id },
                })
              "
            />

            <wt-icon-action
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
                })
              "
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
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import ConditionPopup from './opened-status-condition-popup.vue';
import OpenedStatusConditionWarningPopup from './opened-status-condition-warning-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { namespace: parentCardNamespace } = useCardStore(props.namespace);

const cardNamespace = `${parentCardNamespace}/statusConditions`;

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const isStatusWarningPopupOpened = ref(false);

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
  patchProperty,
} = useTableStore(cardNamespace);

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
} = useTableEmpty({ dataList, error, isLoading });

function closeWarningPopup() {
  isStatusWarningPopupOpened.value = false;
}

async function changeInitialStatus({ index, prop, value }) {
  await patchProperty({ index, prop, value });
  await loadData();
}

async function changeProperty({ index, prop, value }) {
  try {
    await patchProperty({ index, prop, value });
  } catch (err) {
    isStatusWarningPopupOpened.value = true;
    console.error(err);
  }
}
</script>

<style lang="scss" scoped>
.opened-status-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
