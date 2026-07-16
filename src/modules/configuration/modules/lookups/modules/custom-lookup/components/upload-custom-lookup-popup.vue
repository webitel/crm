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
import type { DataBatchCreateDatasetResponse } from '@webitel/api-services/gen/models';
import type { EventBus } from '@webitel/ui-sdk/composables';
import WtUploadCsvPopup from '@webitel/ui-sdk/src/modules/UploadCsvPopup/components/wt-upload-csv-popup.vue';
import { inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import CustomLookupApi from '../api/custom-lookups';
import {
	createEmptyCsvImportResult,
	mergeCsvImportChunk,
	notifyCsvImportResult,
} from '../utils/csvImportResult';
import {
	type LookupCsvField,
	prepareCsvLookupRows,
} from '../utils/prepareCsvLookupRows';

type CsvMappingField = {
	name?: string;
	required?: boolean;
	locale?: string;
	kind?: string;
	csv: string;
};

const props = defineProps<{
	file: File | null;
	fields: LookupCsvField[];
	repo: string;
}>();

const emit = defineEmits<(e: 'close') => void>();

const { t } = useI18n();
const eventBus = inject<EventBus>('$eventBus');

const mappingFields = ref<CsvMappingField[]>([]);
const importResult = ref<DataBatchCreateDatasetResponse | null>(null);
const rowOffset = ref(0);

const resetImportState = () => {
	importResult.value = null;
	rowOffset.value = 0;
};

const close = () => {
	notifyCsvImportResult({
		result: importResult.value,
		t,
		eventBus,
	});
	resetImportState();
	emit('close');
};

const saveBulkData = async (data: Record<string, unknown>[]) => {
	const rows = prepareCsvLookupRows(data, props.fields);
	const chunk = await CustomLookupApi.batchCreate({
		repo: props.repo,
		rows,
	});

	importResult.value = mergeCsvImportChunk(
		importResult.value ?? createEmptyCsvImportResult(),
		chunk,
		rowOffset.value,
	);
	rowOffset.value += rows.length;
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
