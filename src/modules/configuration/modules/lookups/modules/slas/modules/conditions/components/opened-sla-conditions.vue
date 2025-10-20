<template>
  <section class="table-page opened-sla-conditions">
    <condition-popup
      :namespace="SLAConditionsCardNamespace"
      @load-data="loadDataList"
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
        :disabled:delete="!hasDeleteAccess || !selected.length"
        :disabled:add="!hasCreateAccess"
        @click:add="add"
        @click:refresh="loadDataList"
        @click:delete="
          askDeleteConfirmation({
            deleted: selected,
            callback: () => deleteEls(selected),
          })
        "
      >
        <template #search-bar>
          <dynamic-filter-search
            :filters-manager="filtersManager"
            :is-filters-restoring="isFiltersRestoring"
            @filter:add="addFilter"
            @filter:update="updateFilter"
            @filter:delete="deleteFilter"
          />
        </template>
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
        :selected="selected"
        sortable
        @sort="updateSort"
        @update:selected="updateSelected"
      >
        <template #name="{ item }">
          {{ item.name }}
        </template>
        <template #priorities="{ item }">
          <wt-display-chip-items
            v-if="item.priorities?.length"
            :items="item.priorities"
            class="opened-sla-conditions__priorities"
          />
        </template>
        <template #reactionTime="{ item }">
          {{ ConvertDurationWithDays(item.reactionTime) }}
        </template>
        <template #resolutionTime="{ item }">
          {{ ConvertDurationWithDays(item.resolutionTime) }}
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
                callback: () => deleteEls(item),
              })
            "
          />
        </template>
      </wt-table>

      <wt-pagination
        :next="next"
        :prev="page > 1"
        :size="size"
        debounce
        @change="updateSize"
        @next="updatePage(page + 1)"
        @prev="updatePage(page - 1)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import {WtDisplayChipItems,WtEmpty} from '@webitel/ui-sdk/src/components/index';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import {useTableEmpty} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import {useCardStore} from '@webitel/ui-sdk/store';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute, useRouter} from 'vue-router';

import {useUserAccessControl} from '../../../../../../../../../app/composables/useUserAccessControl';
import ConvertDurationWithDays from '../../../../../../../../../app/scripts/convertDurationWithDays.js';
import {SLAConditionsCardNamespace} from "../namespace";
import {useSLAConditionsStore} from '../stores/conditions';
import ConditionPopup from './opened-sla-condition-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const {hasCreateAccess, hasUpdateAccess, hasDeleteAccess} =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

const {id: parentId} = useCardStore(
  props.namespace,
);

const router = useRouter();
const route = useRoute();
const {t} = useI18n();

const tableStore = useSLAConditionsStore();

const {
  dataList,
  selected,
  error,
  isLoading,
  page,
  size,
  next,
  headers,
  filtersManager,
  isFiltersRestoring,
} = storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
  deleteEls,
  addFilter,
  updateFilter,
  deleteFilter,
} = tableStore;

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
} = useTableEmpty({
  dataList,
  filters: computed(() => filtersManager.value.getAllValues()),
  error,
  isLoading,
});

const add = () => {
  return router.push({...route, params: {conditionId: 'new'}});
};

initialize({
  parentId: parentId.value,
});
</script>

<style lang="scss" scoped>
.opened-sla-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
