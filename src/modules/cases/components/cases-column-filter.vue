<template>
  <column-filter
    :header="header"
    :index="index"
    :form-view="formView"
    :hide="hide"
    :filters-manager="filtersManager"
    :filterable-extension-fields="filterableExtensionFields"
    @add:filter="addFilter"
    @update:filter="updateFilter"
    @delete:filter="deleteFilter"
  />
</template>

<script lang="ts" setup>
import type { DataField } from '@webitel/api-services/gen/models';
import type { DatalistTableHeader } from '@webitel/ui-datalist';
import { ColumnFilterComponent as ColumnFilter } from '@webitel/ui-datalist/filters';
import { storeToRefs } from 'pinia';

import { useCasesDatalistStore } from '../stores/datalist/casesDatalistStore';

defineProps<{
	header: DatalistTableHeader;
	filterableExtensionFields?: DataField[];
	formView?: boolean;
	index?: number;
	hide?: () => void;
}>();

const tableStore = useCasesDatalistStore();
const { filtersManager } = storeToRefs(tableStore);

const { addFilter, updateFilter, deleteFilter } = tableStore;
</script>

<style lang="scss" scoped></style>
