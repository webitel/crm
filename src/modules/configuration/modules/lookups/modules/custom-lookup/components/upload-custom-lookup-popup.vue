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
import WtUploadCsvPopup
  from '@webitel/ui-sdk/src/components/on-demand/wt-upload-csv-popup/components/wt-upload-csv-popup.vue';
import { ref } from 'vue';

import CustomLookupApi from '../api/custom-lookups';

const baseLocale = 'objects.directory.users.csvMappingFields';

const props = defineProps<{
  file: File | null
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const mappingFields = ref([
  {
    name: 'username',
    required: true,
    locale: `${baseLocale}.login`,
    csv: '',
  },
  {
    name: 'name',
    required: true,
    locale: `${baseLocale}.name`,
    csv: '',
  },
  {
    name: 'extension',
    required: false,
    locale: `${baseLocale}.extension`,
    csv: '',
  },
  {
    name: 'email',
    required: false,
    locale: `${baseLocale}.email`,
    csv: '',
  },
]);

const close = () => {
  emit('close');
};

const addItem = (itemInstance) => {
  return CustomLookupApi.add({
    itemInstance,
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
