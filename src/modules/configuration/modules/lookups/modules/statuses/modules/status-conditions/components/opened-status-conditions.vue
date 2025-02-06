<template>
  <section class="table-page opened-status-conditions">
    <condition-popup
      :namespace="cardNamespace"
      @load-data="loadData"
    />

    <opened-status-condition-warning-popup
      :shown="isStatusWarningPopupOpened"
      @close="setWarningPopupState(false)"
    />

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :delete-count="deleteCount"
      :callback="deleteCallbackWrapper"
      @close="closeDelete"
    />

    <header class="table-title">
      <h3 class="table-title__title">
        {{ t('lookups.statuses.statuses', 2) }}
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
              @change="changeInitialStatus({ index, value: $event })"
            />
          </template>

          <template #final="{ item, index }">
            <wt-switcher
              :value="item.final"
              @change="changeFinalStatus({ item, index, value: $event })"
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
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import StatusConditionsAPI from '../api/status-conditions.js';
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
const store = useStore();

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

  resetFilters,
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
  resetFilters();
});

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

async function deleteCallbackWrapper() {
  try {
    await deleteCallback.value();
  } catch (error) {
    if (Array.isArray(error)) {
      const isInitialOrFinalStatusDeleted = error.find(
        (err) => err?.reason?.status === 400,
      );

      setWarningPopupState(!!isInitialOrFinalStatusDeleted);
    } else {
      setWarningPopupState(error.status === 400);
    }
  }
}

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
} = useTableEmpty({ dataList, error, isLoading });

async function setWarningPopupState(value) {
  isStatusWarningPopupOpened.value = value;

  if (!value) {
    await loadData();
  }
}

async function changeInitialStatus({ index, value }) {
  try {
    dataList.value[index].initial = value;
    const hasTrueValue = dataList.value.find((el) => el.initial);
    if (!value && !hasTrueValue) {
      setWarningPopupState(true);
      return;
    }

    dataList.value.forEach((el) => (el.initial = false));
    dataList.value[index].initial = value;

    await patchProperty({ index, prop: 'initial', value });
  } catch (err) {
    console.error(err);
  }
}

const parentId = computed(
  () => store.getters[`${cardNamespace}/table/PARENT_ID`],
);
async function changeFinalStatus({ item, index, value }) {
  try {
    dataList.value[index].final = value;
    await StatusConditionsAPI.patch({
      id: item.id,
      parentId: parentId.value,
      changes: { final: value },
    });
  } catch (err) {
    if (err.status !== 400) {
      return;
    }
    setWarningPopupState(true);
  }
}
</script>

<style lang="scss" scoped>
.opened-status-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
