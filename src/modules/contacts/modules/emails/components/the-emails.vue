<template>
  <div class="emails">
    <wt-loader v-show="isLoading"></wt-loader>

    <wt-dummy
      v-if="!isLoading && showDummy"
    ></wt-dummy>

    <div v-show="!isLoading && !showDummy" class="table-wrapper">
      <wt-table
        :headers="headers"
        :data="dataList"
        :grid-actions="hasEditAccess || hasDeleteAccess"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template v-slot:primary="{ item }">
          <wt-icon
            v-if="item.primary"
            icon="tick"
            color="success"
          ></wt-icon>
        </template>
        <template v-slot:type="{ item }">
          {{ item.type.name }}
        </template>
        <template v-slot:actions="{ item }">
          <wt-icon-btn
            icon="options"
          ></wt-icon-btn>
        </template>
      </wt-table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { useAccess } from '../../../../../app/composables/useAccess';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const baseNamespace = `${props.namespace}/emails`;

const { t } = useI18n();

const {
  namespace,

  dataList,
  isLoading,
  headers,
  error,

  deleteData,
  sort,
} = useTableStore(baseNamespace);

const {
  hasCreateAccess,
  hasEditAccess,
  hasDeleteAccess,
} = useAccess();

const { filtersNamespace } = useTableFilters(namespace);

const showDummy = computed(() => !dataList.value.length);
</script>

<style lang="scss" scoped>

</style>
