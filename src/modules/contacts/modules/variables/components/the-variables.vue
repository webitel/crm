<template>
  <div class="variables">
    <header class="variables-header">
      <variable-popup
        :namespace="namespace"
        @close="closeItemPopup"
      />
      <wt-icon-action
        :disabled="!access.hasRbacEditAccess || isReadOnly"
        action="add"
        @click="addItem"
      />
    </header>

    <delete-confirmation-popup
      :callback="deleteCallback"
      :delete-count="deleteCount"
      :shown="isConfirmationPopup"
      @close="closeDelete"
    />

    <wt-loader v-show="isLoading" />

    <wt-dummy
      v-if="!isLoading && showDummy"
      :dark-mode="darkMode"
    />

    <div
      v-show="!isLoading && !showDummy"
      class="table-wrapper"
    >
      <wt-table
        :data="dataList"
        :headers="headers"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template #key="{ item }">
          {{ item.key }}
        </template>
        <template #value="{ item }">
          {{ item.value }}
        </template>
        <template #actions="{ item }">
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess || isReadOnly"
            action="edit"
            @click="editItem(item)"
          />
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess || isReadOnly"
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
      <filter-pagination
        :is-next="isNext"
        :namespace="filtersNamespace"
      />
    </div>
  </div>
</template>

<script setup>
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { computed, inject, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import VariablePopup from './variable-popup.vue';

const access = inject('access');
const isReadOnly = inject('isReadOnly');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();
const router = useRouter();
const route = useRoute();
const variablesNamespace = `${props.namespace}/variables`;

const {
  namespace,
  dataList,
  isLoading,
  headers,
  isNext,

  sort,
  deleteData,
  onFilterEvent,
} = useTableStore(variablesNamespace);

const {
  namespace: filtersNamespace,
  subscribe,
  flushSubscribers,
  restoreFilters,
} = useTableFilters(`${variablesNamespace}/table`);

subscribe({ event: '*', callback: onFilterEvent });

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
});

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const showDummy = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

async function save(item) {
  if (item.id) {
    await store.dispatch(`${variablesNamespace}/table/UPDATE_VARIABLE`, {
      etag: item.etag,
      itemInstance: { ...item },
    });
  } else {
    await store.dispatch(`${variablesNamespace}/table/ADD_VARIABLE`, {
      itemInstance: { ...item },
    });
  }
}

function addItem() {
  return router.push({
    ...route,
    params: { variableId: 'new' },
  });
}

function editItem({ id }) {
  return router.push({
    ...route,
    params: { variableId: id },
  });
}

function closeItemPopup() {
  const params = { ...route.params };
  delete params.variableId;

  return router.push({
    ...route,
    params,
  });
}
</script>

<style lang="scss" scoped>
.variables {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.variables-header {
  display: flex;
  justify-content: flex-end;
}
</style>
