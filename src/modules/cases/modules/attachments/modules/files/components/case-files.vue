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
        <h3 class="case-section-title">
          {{ t('cases.attachments.files') }}
        </h3>
        <wt-action-bar
          :include="filteredActions"
          :disabled:delete="isBulkDeleteDisabled"
          :disabled:add="isTableActionAddDisabled"
          @click:add="openFileDialog"
          @click:download="handleSelectedFilesDownload"
          @click:delete="
            askDeleteConfirmation({
              deleted: selected,
              callback: () => handleBulkDelete(selected),
            })
          "
        >
          <template #download="{ action, onClick }">
            <wt-loader
              v-if="isZipDownloading"
              :size="ComponentSize.SM"
            />
            <wt-icon-action
              v-else
              :action="action"
              :disabled="isTableActionDownloadDisabled"
              @click="onClick"
            />
          </template>
        </wt-action-bar>
      </header>

      <wt-empty
        v-show="showEmpty && !isPendingItemsLoading"
        :text="t('cases.attachments.emptyFilesText')"
      />

      <wt-loader
        v-show="isLoading || isPendingItemsLoading"
        :size="ComponentSize.SM"
        class="case-files__table-loader"
      />

      <div
        v-show="isTableVisible"
        class="table-section__table-wrapper"
      >
        <wt-table
          :data="currentDataList"
          :headers="headers"
          :selected="selected"
          :selectable="isEditable"
          headless
          @update:selected="updateSelected"
        >
          <template #name="{ item }">
            <div class="case-files__name-wrapper">
              <wt-icon
                class="case-files__icon"
                :icon="getFileTypeIcon(item.mime)"
              />
              <span
                class="case-files__name"
                :class="{ 'case-files__name--disabled': isNew }"
                @click="!isNew && openStorageFileInNewTab(item)"
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
            <wt-loader
              v-if="isFileDownloading(item?.id)"
              :size="ComponentSize.SM"
            />
            <wt-icon-action
              v-else
              :disabled="isNew"
              action="download"
              @click="downloadRowFile(item)"
            />
            <wt-icon-action
              v-if="isFileDeleteAction(item)"
              :disabled="isFileDeleteActionDisabled"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => handleFileDelete(item),
                })
              "
            />
          </template>
        </wt-table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { downloadFile } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { type EventBus, useDownloadAction } from '@webitel/ui-sdk/composables';
import { ComponentSize, IconAction } from '@webitel/ui-sdk/enums';
import {
	downloadFilesAsZip,
	getFileTypeIcon,
	openStorageFileInNewTab,
} from '@webitel/ui-sdk/scripts/file';
import webSocketClientController from '@webitel/ui-sdk/src/api/websocket/WebSocketClientController';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { storeToRefs } from 'pinia';
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../../../stores/card/casesCardStore';
import { useCaseAttachments } from '../../../composables/useCaseAttachments';
import { AttachmentsTypes } from '../../../enums/AttachmentsTypes';
import { FileSources } from '../enums/FileSources';
import { useCaseFilesDatalistStore } from '../stores/datalist/caseFilesDatalistStore';

const props = defineProps<{
	itemId: string;
}>();

const { isEditable, isReadOnly } = useCaseAccessState();
const { modelValue, isNew } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});
const { t } = useI18n();
const eventBus = inject<EventBus>('$eventBus');

// [Claude] files are saved/deleted on existing case immediately, without "Save" click, so we inform user about it
function showInfoNotification(textKey: string) {
	eventBus?.$emit('notification', {
		type: 'info',
		text: t(textKey),
	});
}

const { hasCreateAccess, hasDeleteAccess } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const filesStore = useCaseFilesDatalistStore();
const {
	dataList,
	selected,
	isLoading,
	shownHeaders: headers,
} = storeToRefs(filesStore);
const { loadDataList, deleteEls, updateSelected, updateSize, initialize } =
	filesStore;

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
	source: FileSources.Direct,
	file: fileData,
});

const addFile = async (file) => {
	const cliInstance = await webSocketClientController.getCliInstance();
	await cliInstance.storeFile(
		props.itemId,
		[
			file.file,
		],
		null,
		'case',
	);
};

const {
	pendingItems: pendingFiles,
	isPendingItemsLoading,
	addNewItem,
	handleDeleteData,
	deletePendingItem,
	deleteMultiplePendingItems,
} = useCaseAttachments({
	itemInstance: modelValue,
	isNew,
	storePath: AttachmentsTypes.Files,
	loadData: loadDataList,
	transformStoreItemToPending,
	processItemToAPI: addFile,
	deleteData: deleteEls,
});

const currentDataList = computed(() =>
	isNew.value ? pendingFiles.value : dataList.value,
);
const { showEmpty } = useTableEmpty({
	dataList: currentDataList,
	isLoading,
});

const filteredActions = computed(() => {
	const actions: Array<(typeof IconAction)[keyof typeof IconAction]> = [
		IconAction.DOWNLOAD,
	];
	if (!isReadOnly) {
		actions.push(IconAction.ADD, IconAction.DELETE);
	}
	return actions;
});

updateSize(100);
if (!isNew.value) {
	initialize({
		parentId: props.itemId,
	});
}

/* [Claude] separate instances: a row download must not spin the zip icon and vice versa */
const { isLoading: isZipDownloading, runDownload: runZipDownload } =
	useDownloadAction();
const { isKeyLoading: isFileDownloading, runDownload: runFileDownload } =
	useDownloadAction();

function handleSelectedFilesDownload() {
	return runZipDownload(() => {
		const token = localStorage.getItem('access-token');
		const apiUrl = import.meta.env.VITE_API_URL;

		const filesToDownload = selected.value.length
			? selected.value
			: dataList.value;

		return downloadFilesAsZip({
			filesToDownload,
			apiUrl,
			token,
		});
	});
}

/* [Claude] fetched instead of a plain link, so we know when the download ends – for the loader and toasts */
function downloadRowFile(item: { id?: string; name?: string }) {
	if (!item?.id) return;
	return runFileDownload(() => downloadFile(item.id, item.name), {
		key: item.id,
	});
}

const fileInput = ref(null);

async function handleFileInput(event) {
	const files = Array.from(event.target.files);

	await processMultipleFiles(files);
	resetFileInput();

	if (!isNew.value && files.length) {
		showInfoNotification('cases.attachments.notifications.attachmentAdded');
	}
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
	selected.value.some((item) => item.source !== FileSources.Direct),
);

const isBulkDeleteDisabled = computed(() => {
	return (
		!hasDeleteAccess.value ||
		!isEditable.value ||
		!selected.value.length ||
		hasNonDirectFileSelected.value ||
		isPendingItemsLoading.value
	);
});

const isTableActionDownloadDisabled = computed(() => {
	return (
		!currentDataList.value.length || isPendingItemsLoading.value || isNew.value
	);
});

const isTableActionAddDisabled = computed(() => {
	return (
		!hasCreateAccess.value || !isEditable.value || isPendingItemsLoading.value
	);
});

const isTableVisible = computed(() => {
	return (
		!isLoading.value &&
		currentDataList.value.length &&
		!isPendingItemsLoading.value
	);
});

const isFileDeleteAction = computed(() => (item) => {
	return !isReadOnly && item?.source === FileSources.Direct;
});

const isFileDeleteActionDisabled = computed(() => {
	return !isEditable.value || !hasDeleteAccess.value;
});

// Function to handle single file deletion (pending or existing)
async function handleFileDelete(file) {
	if (isNew.value) {
		await deletePendingItem(file);
		return;
	}

	await handleDeleteData(file);
	showInfoNotification('cases.attachments.notifications.attachmentDeleted');
}

// Function to handle bulk deletion of files (pending or existing)
async function handleBulkDelete(files) {
	if (isNew.value) {
		await deleteMultiplePendingItems(files);
		return;
	}

	await handleDeleteData(files);
	showInfoNotification('cases.attachments.notifications.attachmentDeleted');
}
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

  // [Claude] only the table loader is centered; download loaders sit inline with the action icons
  &__table-loader {
    margin: auto;
  }
}
</style>
