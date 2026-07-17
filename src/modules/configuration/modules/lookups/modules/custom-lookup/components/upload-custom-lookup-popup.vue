<template>
  <wt-upload-csv-popup
    :add-bulk-items="saveBulkData"
    :file="props.file"
    :mapping-fields="mappingFields"
    v-bind="$attrs"
    @close="close"
  />
</template>

<script setup lang="ts">
import { DictionariesAPI } from '@webitel/api-services/api';
import WtUploadCsvPopup from '@webitel/ui-sdk/src/modules/UploadCsvPopup/components/wt-upload-csv-popup.vue';
import { ref, watch } from 'vue';

import { useCsvImportResult } from '../composables/useCsvImportResult';
import { type CsvMappingField, type LookupCsvField } from '../types/csvImport';
import { prepareCsvLookupRows } from '../utils/prepareCsvLookupRows';

const props = defineProps<{
	file: File | null;
	fields: LookupCsvField[];
	repo: string;
}>();

const emit = defineEmits<(e: 'close') => void>();

const mappingFields = ref<CsvMappingField[]>([]);
const { addChunk, notify, reset } = useCsvImportResult();

const close = () => {
	notify();
	reset();
	emit('close');
};

const saveBulkData = async (data: Record<string, unknown>[]) => {
	const rows = prepareCsvLookupRows(data, props.fields);
	const chunk = await DictionariesAPI.batchCreate({
		repo: props.repo,
		rows,
	});

	addChunk(chunk, rows.length);
};

watch(
	() => props.fields,
	() => {
		mappingFields.value = props.fields
			? props.fields
					.filter((field) => !field.readonly)
					.map((field) => ({
						name: field?.value,
						required: field?.required,
						locale: field?.locale,
						kind: field?.kind,
						csv: '',
					}))
			: [];
	},
	{
		immediate: true,
	},
);
</script>
