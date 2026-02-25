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
import WtUploadCsvPopup from '@webitel/ui-sdk/src/modules/UploadCsvPopup/components/wt-upload-csv-popup.vue';
import { ref } from 'vue';

import CustomLookupApi from '../api/custom-lookups';

const props = defineProps<{
	file: File | null;
	fields: never[];
	repo: string;
}>();

const emit = defineEmits<{
	(e: 'close'): void;
}>();

const mappingFields = ref(
	props.fields
		? props.fields
				.filter((field) => !field.readonly)
				.map((field) => ({
					name: field?.value,
					required: field?.required,
					locale: field?.locale,
					csv: '',
				}))
		: [],
);

const close = () => {
	emit('close');
};

const addItem = (itemInstance) => {
	return CustomLookupApi.add({
		itemInstance,
		fieldsToSend: props.fields?.map((field) => field.value),
		repo: props.repo,
	});
};

const saveBulkData = async (data) => {
	let processedChunkIndex = 1;
	try {
		for (const item of data) {
			await addItem(item);
			processedChunkIndex += 1;
		}
	} catch (err) {
		throw `An error occurred during saving ${processedChunkIndex} record: ${JSON.stringify(err)}`;
	}
};
</script>
