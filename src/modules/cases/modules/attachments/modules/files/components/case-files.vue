<template>
  <delete-confirmation-popup
    :callback="deleteCallback"
    :delete-count="deleteCount"
    :shown="isConfirmationPopup"
    @close="closeDelete"
  />
  <div class="case-files table-page">
    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('cases.attachments.attachments') }}
        </h3>
        <wt-action-bar
          :include="[IconAction.ADD]"
          @click:add="openFileDialog"
        >
          <wt-icon-btn
            :disabled="!editMode"
            class="icon-action"
            icon="bucket"
            @click="askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteData(selected),
            })"
          />
        </wt-action-bar>
      </header>

      <wt-loader v-show="isLoading" />

      <div
        v-show="!isLoading && dataList.length"
        class="table-section__table-wrapper"
      >
        <wt-table
          :data="dataList"
          :headers="headers"
          :selected="selected"
          headless
          @update:selected="setSelected"
        >
          <template #name="{ item }">
            {{ item?.name }}
          </template>

          <template #createdBy="{ item }">
            {{ item?.createdBy?.name }}
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              :disabled="!editMode"
              action="delete"
              @click="askDeleteConfirmation({
                deleted: [item],
                callback: () => deleteData(item),
              })"
            />
          </template>
        </wt-table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { inject, onUnmounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
});

const store = useStore();

const client = store.getters['CLIENT'];

const { t } = useI18n();
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
} = useTableStore(props.namespace);

const {
  namespace: filtersNamespace,
  restoreFilters,
  subscribe,
  flushSubscribers,
} = useTableFilters(namespace);

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();
onUnmounted(() => {
  flushSubscribers();
});

const editMode = inject('editMode');

const fileInput = ref(null);
const uploadingSnapshots = ref([]);

const emit = defineEmits(['fileUploaded']);

const handleFileInput = async (event) => {
  const files = Array.from(event.target.files);
  for (const file of files) {
    await uploadFile(file);
  }

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadFile = async (uploadedFile) => {
  const snapshot = makeFileSnapshot(uploadedFile);
  uploadingSnapshots.value.push(snapshot);
  try {
    const fileUploadProgress = ({ loaded, total }) => {
      snapshot.metadata.progress = { loaded, total };
    };
    const cliInstance = await client.getCliInstance();
    const storedFile = await cliInstance.storeFile(props.itemId, [uploadedFile], fileUploadProgress, 'case');
    console.log(storedFile);
    handleFileSuccessUpload(snapshot, storedFile);
  } catch (err) {
    handleFileErrorUpload(snapshot, err);
  }
};

const handleFileSuccessUpload = (snapshot, file) => {
  snapshot.metadata.done = true;
  setTimeout(() => {
    const index = uploadingSnapshots.value.indexOf(snapshot);
    if (index > -1) {
      uploadingSnapshots.value.splice(index, 1);
    }
    emit('fileUploaded', file);
  }, 1600);
};

const handleFileErrorUpload = (snapshot, err) => {
  snapshot.metadata.error = true;
  setTimeout(() => {
    snapshot.metadata.close = () => {
      const index = uploadingSnapshots.value.indexOf(snapshot);
      if (index > -1) {
        uploadingSnapshots.value.splice(index, 1);
      }
    };
  }, 1600);
};

const makeFileSnapshot = (file) =>
  reactive({
    name: file.name,
    mime: file.type,
    size: file.size,
    metadata: {
      progress: {
        total: 0,
        loaded: 0,
      },
      done: false,
      close: false,
      error: false,
    },
  });

const openFileDialog = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.addEventListener('change', handleFileInput);
  input.click();
};
</script>

<style lang="scss" scoped>
</style>
