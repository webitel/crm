<template>
  <column-filter
    :header="(header as DatalistTableHeader)"
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
import type { WtTableHeader } from '@webitel/ui-sdk/src/components/wt-table/types/WtTable';
import { storeToRefs } from 'pinia';

import { useCasesDatalistStore } from '../stores/datalist/casesDatalistStore';

defineProps<{
	header: WtTableHeader;
	filterableExtensionFields?: DataField[];
	formView?: boolean;
	hide?: () => void;
}>();

const tableStore = useCasesDatalistStore();
const { filtersManager } = storeToRefs(tableStore);

const { addFilter, updateFilter, deleteFilter } = tableStore;
</script>

<style lang="scss" scoped></style>
