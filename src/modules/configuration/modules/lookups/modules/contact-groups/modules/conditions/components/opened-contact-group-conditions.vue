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
        :disabled:add="!hasCreateAccess"
        @click:add="add"
        @click:refresh="loadData"
      >
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
        v-if="dataList.length && !isLoading"
        :data="dataList"
        :headers="headers"
        :selectable="false"
        :row-reorder="hasUpdateAccess"
        @reorder:row="handleReorder"
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
          <wt-icon-action
            :disabled="!hasUpdateAccess"
            action="edit"
            @click="
              router.push({ ...route, params: { conditionId: item.id } })
            "
          />
          <wt-icon-action
            :disabled="!hasDeleteAccess"
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
        :namespace="filtersNamespace"
        :next="isNext"
      />
    </div>
  </section>
</template>

<script setup>
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import ConditionsAPI from '../api/conditions.js';
import ConditionPopup from './opened-contact-group-conditions-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { namespace: parentCardNamespace, id: parentId } = useCardStore(
  props.namespace,
);

const namespace = `${parentCardNamespace}/conditions`;

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

const {
  namespace: tableNamespace,
  dataList,
  isLoading,
  headers,
  isNext,
  error,
  loadData,
  deleteData,
  onFilterEvent,
} = useTableStore(namespace);

const {
  namespace: filtersNamespace,
  restoreFilters,
  filtersValue,

  subscribe,
  flushSubscribers,
  resetFilters,
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
  primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({ dataList, filters: filtersValue, error, isLoading });

const add = () => {
  return router.push({ ...route, params: { conditionId: 'new' } });
};

function setPosition(newIndex, list) {
  if (newIndex === 0)
    return {
      condDown: dataList.value[0].id,
      condUp: 0,
    };

  if (newIndex === list.length - 1)
    return {
      condDown: 0,
      condUp: dataList.value[dataList.value.length - 1].id,
    };

  return {
    condDown: list[newIndex - 1].id,
    condUp: list[newIndex + 1].id,
  };
}
const handleReorder = async ({ oldIndex, newIndex }) => {
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
};

onUnmounted(() => {
  flushSubscribers();
  resetFilters();
});
</script>