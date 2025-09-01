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
          {{ t('cases.attachments.files') }}
        </h3>
        <wt-action-bar
          :include="filteredActions"
          :disabled:delete="isBulkDeleteDisabled || isSubmitting || isNew"
          :disabled:download="!currentDataList.length || isSubmitting || isNew"
          :disabled:add="!hasCreateAccess || !editMode || isSubmitting"
          @click:add="openFileDialog"
          @click:download="handleSelectedFilesDownload"
          @click:delete="
            askDeleteConfirmation({
              deleted: selected,
              callback: () => handleDeleteData(selected),
            })
          "
        >
        </wt-action-bar>
      </header>

      <wt-empty
        v-show="showEmpty && !isSubmitting"
        :text="emptyText"
      />

      <wt-loader v-show="isLoading || isSubmitting" />

      <div
        v-show="!isLoading && currentDataList.length && !isSubmitting"
        class="table-section__table-wrapper"
      >
        <wt-table
          :data="currentDataList"
          :headers="headers"
          :selected="selected"
          :selectable="editMode"
          headless
          @update:selected="setSelected"
        >
          <template #name="{ item }">
            <div class="case-files__name-wrapper">
              <wt-icon
                class="case-files__icon"
                :icon="getFileIcon(item.mime)"
              />
              <span
                class="case-files__name"
                :class="{ 'case-files__name--disabled': isNew }"
                @click="!isNew ? openFileInNewTab(item) : null"
              >{{ item?.name }}</span
              >
            </div>
          </template>

          <template #createdBy="{ item }">
            {{ item?.createdBy?.name }}
          </template>
          <template #size="{ item }">
            {{ prettifyFileSize(item.size) }}
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              :disabled="isNew"
              action="download"
              @click="
                downloadFile({
                  id: item?.id,
                  name: item?.name,
                  type: item?.mime,
                })
              "
            />
            <wt-icon-action
              v-if="!isReadOnly && (item.source === FileSources.Direct || isNew)"
              :disabled="!editMode || !hasDeleteAccess || isNew"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => handleDeleteData(item),
                })
              "
            />
          </template>
        </wt-table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { WtEmpty } from '@webitel/ui-sdk/components';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import {
  useTableEmpty,
} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { computed, inject, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import downloadFile from '../../../../../../../app/utils/downloadFile.js';
import downloadFilesInZip from '../../../../../../../app/utils/downloadFilesInZip.js';
import getFileIcon from '../../../../../../../app/utils/fileTypeIcon.js';
import openFileInNewTab from '../../../../../../../app/utils/openFileInNewTab.js';
import { useCaseAttachments } from '../../../composables/useCaseAttachments.js';
import { FileSources } from '../enums/FileSources.js';

const props = defineProps({
  filesNamespace: {
    type: String,
    required: true,
  },
  namespace: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
});

const isReadOnly = inject('isReadOnly');
const editMode = inject('editMode');
const store = useStore();

const { t } = useI18n();

const { hasCreateAccess, hasDeleteAccess } =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

// Original table store logic
const {
  namespace: linksFilesNamespace,
  dataList,
  selected,
  isLoading,
  headers,
  loadData,
  deleteData,
  setSelected,
  onFilterEvent,
} = useTableStore(props.filesNamespace);

const {
  restoreFilters,
  subscribe,
  flushSubscribers,
} = useTableFilters(linksFilesNamespace);

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

// Transform and process functions for files
const transformStoreItemToPending = (fileData) => ({
  name: fileData.name,
  size: fileData.size,
  mime: fileData.type,
  file: fileData,
});

const client = store.getters['CLIENT'];

const processItemToAPI = async (file) => {
  const cliInstance = await client.getCliInstance();
  await cliInstance.storeFile(props.itemId, [file.file], null, 'case');
};

// Use attachment creation composable
const {
  isNew,
  pendingItems: pendingFiles,
  isSubmitting,
  addNewItem,
  handleDeleteData,
} = useCaseAttachments({
  cardNamespace: props.namespace,
  itemId: props.itemId,
  storePath: 'files',
  loadData,
  transformStoreItemToPending,
  processItemToAPI,
  deleteData,
});

const currentDataList = computed(() => isNew.value ? pendingFiles.value : dataList.value);
const { showEmpty } = useTableEmpty({ dataList: currentDataList, isLoading });

const emptyText = computed(() => {
  return t('cases.attachments.emptyFilesText');
});

const filteredActions = computed(() => {
  const actions = [IconAction.DOWNLOAD];
  if (!isReadOnly) {
    actions.push(IconAction.ADD, IconAction.DELETE);
  }
  return actions;
});

subscribe({
  event: '*',
  callback: (...args) => {
    if (!isNew.value) {
      onFilterEvent(...args);
    }
  },
});

if (!isNew.value) {
  restoreFilters();
}

onUnmounted(() => {
  flushSubscribers();
});

async function handleSelectedFilesDownload() {
  const token = localStorage.getItem('access-token');
  const apiUrl = import.meta.env.VITE_API_URL;

  const filesToDownload = selected.value.length
    ? selected.value
    : dataList.value;

  await downloadFilesInZip({ filesToDownload, apiUrl, token });
}

const fileInput = ref(null);

async function handleFileInput(event) {
  const files = Array.from(event.target.files);

  await processMultipleFiles(files);
  resetFileInput();
}

async function processMultipleFiles(files) {
  for (const file of files) {
    await uploadFile(file);
  }
}

function resetFileInput() {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

async function uploadFile(uploadedFile) {
  await addNewItem(transformStoreItemToPending(uploadedFile), uploadedFile);
}

function openFileDialog() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.addEventListener('change', handleFileInput);
  input.click();
}

const hasNonDirectFileSelected = computed(() =>
  selected.value.some(item => item.source !== FileSources.Direct)
);

const isBulkDeleteDisabled = computed(() => {
  return !hasDeleteAccess.value
    || !editMode.value
    || !selected.value.length
    || hasNonDirectFileSelected.value;
});
</script>

<style lang="scss" scoped>
.case-files {
  &__name-wrapper {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__icon {
    flex-shrink: 0;
  }

  &__name {
    color: var(--link-color);
    cursor: pointer;

    &:hover {
      color: var(--link--hover-color);
    }

    &--disabled {
      color: var(--text-color);
      cursor: default;

      &:hover {
        color: var(--text-color);
      }
    }
  }
}
</style>
