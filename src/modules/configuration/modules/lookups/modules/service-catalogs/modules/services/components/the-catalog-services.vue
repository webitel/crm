<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  />
</template>

<script setup>
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore()

const baseNamespace = 'configuration/lookups/services';

const {
  namespace,

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
} = useTableStore(baseNamespace);

onMounted(() => {
  store.dispatch(`${baseNamespace}/table/SELECT_ROOT`, {
    rootId: route.params?.id,
  })

  loadData();
});
</script>
