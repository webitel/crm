<template>
 <div class="permissions">
   <wt-loader v-show="isLoading"></wt-loader>

   <div v-show="!isLoading" class="table-wrapper">
     <wt-table
       :headers="headers"
       :data="dataList"
       :selectable="false"
       sortable
       @sort="sort"
     >
     </wt-table>
     <filter-pagination
       :namespace="filtersNamespace"
       :is-next="isNext"
     ></filter-pagination>
   </div>
 </div>
</template>

<script setup>

import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { useI18n } from 'vue-i18n';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const {
  namespace,

  dataList,
  isLoading,
  headers,
  error,
  isNext,

  patchProperty,
  deleteData,
  sort,
} = useTableStore(`${props.namespace}/permissions`);

const { filtersNamespace } = useTableFilters(namespace);
</script>

<style lang="scss" scoped>

</style>
