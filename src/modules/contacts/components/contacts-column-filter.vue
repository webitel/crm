<template>
  <column-filter
    :header="(header as DatalistTableHeader)"
    :form-view="formView"
    :hide="hide"
    :filters-manager="filtersManager"
    @add:filter="addFilter"
    @update:filter="updateFilter"
    @delete:filter="deleteFilter"
  />
</template>

<script lang="ts" setup>
import type { DatalistTableHeader } from '@webitel/ui-datalist';
import { ColumnFilterComponent as ColumnFilter } from '@webitel/ui-datalist/filters';
import type { WtTableHeader } from '@webitel/ui-sdk/src/components/wt-table/types/WtTable';
import { storeToRefs } from 'pinia';

import { useContactsDatalistStore } from '../stores/datalist/contactsDatalistStore';

defineProps<{
	header: WtTableHeader;
	formView?: boolean;
	hide?: () => void;
}>();

const tableStore = useContactsDatalistStore();
const { filtersManager } = storeToRefs(tableStore);

const { addFilter, updateFilter, deleteFilter } = tableStore;
</script>

<style lang="scss" scoped></style>
