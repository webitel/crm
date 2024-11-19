<template>
  <section class="table-page opened-sla-conditions">
    <condition-popup
      :namespace="namespace"
    />
    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :delete-count="deleteCount"
      :callback="deleteCallback"
      @close="closeDelete"
    />
    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('lookups.slas.conditions', 2) }}
        </h3>

        <wt-actions-bar
          mode="table"
          :actions="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
          @click:add="create"
          @click:refresh="loadData"
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
          {{ item.name }}
        </template>
        <template #priorities="{ item }">
          <div v-if="item.priorities?.length">
            <p>{{ item.priorities[0]?.name }}</p>
            <wt-tooltip
              v-if="item.priorities?.length"
              :triggers="['click']"
            >
              <template #activator>
                <wt-chip>
                  +{{ item.priorities?.length - 1 }}
                </wt-chip>
              </template>

              <timeline-row-initiator
                v-for="({ id, name }) of getHiddenPriorities(item.priorities)"
                :key="id"
                :text="name"
              />
            </wt-tooltip>
          </div>
        </template>
        <template #reactionTime="{ item }">
          {{ item.reactionTime }}
        </template>
        <template #resolutionTime="{ item }">
          {{ item.resolutionTime }}
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
        :next="isNext"
      />
    </div>
  </section>
</template>

<script setup>
import { required } from '@vuelidate/validators';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useCardStore, useTableStore } from '@webitel/ui-sdk/store';
import { onUnmounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import WtActionsBar
  from '../../../../../../../../../../../webitel-ui-sdk/src/components/wt-action-bar/wt-action-bar.vue';
import IconAction from '../../../../../../../../../../../webitel-ui-sdk/src/enums/IconAction/IconAction.enum.js';
import FilterSearch
  from '../../../../../../../../../../../webitel-ui-sdk/src/modules/Filters/components/filter-search.vue';
import TimelineRowInitiator
  from '../../../../../../../../contacts/modules/timeline/components/utils/timeline-row-initiator.vue';
import ConditionPopup from './opened-sla-condition-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const {
  namespace: parentCardNamespace,
  id: parentId,

  addItem,
} = useCardStore(props.namespace);

const namespace = `${parentCardNamespace}/conditions`;

const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();


const { hasCreateAccess, hasEditAccess, hasDeleteAccess } = useAccessControl();



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

console.log(store)

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

const edit = ({id}) => {
  return router.push({
    ...route,
    params: { conditionId: id },
  });

};

// const create = async () => {
//   if (!parentId.value) {
//     await addItem();
//     await router.replace({
//       ...route,
//       params: {
//         ...route.params,
//         id: parentId.value,
//       },
//     });
//   }
//
//   return router.push({
//     ...route,
//     params: {
//       ...route.params,
//       id: 'new',
//     },
//   });
// };

// const prettifyDate = (value) => {
//   return new Date(+value).toLocaleString();
// };

function getHiddenPriorities (item) {
  return item.priorities?.slice(1);
};

</script>

<style lang="scss" scoped>
</style>
