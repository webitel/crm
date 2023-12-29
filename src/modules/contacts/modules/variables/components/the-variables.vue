<template>
  <div class="variables">
    <header class="variables-header">
      <variable-popup
        v-if="isVariablePopup"
        :edited-instance="editedItem"
        :callback="save"
        @close="handleEditedItem"
      ></variable-popup>
      <wt-icon-action
        :disabled="!access.hasRbacEditAccess"
        action="add"
        @click="isVariablePopup = true"
      ></wt-icon-action>
    </header>

    <delete-confirmation-popup
      v-if="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    ></delete-confirmation-popup>

    <wt-loader v-show="isLoading"></wt-loader>

    <wt-dummy
      v-if="!isLoading && showDummy"
      :dark-mode="darkMode"
    ></wt-dummy>

    <div v-show="!isLoading && !showDummy" class="table-wrapper">
      <wt-table
        :headers="headers"
        :data="dataList"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template v-slot:key="{ item }">
          {{ item.key }}
        </template>
        <template v-slot:value="{ item }">
          {{ item.value }}
        </template>
        <template v-slot:actions="{ item }">
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess"
            action="edit"
            @click="handleEditedItem(item)"
          ></wt-icon-action>
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess"
            action="delete"
            @click="askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
                })"
          ></wt-icon-action>
        </template>
      </wt-table>
      <filter-pagination
        :namespace="filtersNamespace"
        :is-next="isNext"
      ></filter-pagination>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useStore } from 'vuex';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import {
  useDeleteConfirmationPopup
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import VariablePopup from './variable-popup.vue';

const access = inject('access');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();
const variablesNamespace = `${props.namespace}/variables`;

const {
  dataList,
  isLoading,
  headers,
  isNext,

  sort,
  deleteData,
} = useTableStore(variablesNamespace);

const { filtersNamespace } = useTableFilters(`${variablesNamespace}/table`);

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const editedItem = ref(null);
const isVariablePopup = ref(false);
const showDummy = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

async function save(item) {
  try {
    isLoading.value = false;
    if (item.id) {
      await store.dispatch(`${variablesNamespace}/table/UPDATE_VARIABLE`, { etag: item.etag, itemInstance: { ...item } });
    } else {
      await store.dispatch(`${variablesNamespace}/table/ADD_VARIABLE`, { itemInstance: { ...item } });
    }
  } finally {
    isLoading.value = false;
    isVariablePopup.value = false;
    editedItem.value = null;
  }
}

function handleEditedItem(item) {
  editedItem.value = item || null;
  isVariablePopup.value = !!item;
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
