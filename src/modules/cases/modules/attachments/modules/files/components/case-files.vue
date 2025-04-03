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
          :disabled:delete="!hasDeleteAccess || !editMode || !selected.length"
          :disabled:download="!dataList.length"
          :disabled:add="!hasCreateAccess || !editMode"
          @click:add="openFileDialog"
          @click:download="handleSelectedFilesDownload"
          @click:delete="
            askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteData(selected),
            })
          "
        >
        </wt-action-bar>
      </header>

      <wt-empty
        v-show="showEmpty"
        :text="emptyText"
      />

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
            <div class="case-files__name-wrapper">
              <wt-icon
                class="case-files__icon"
                :icon="getFileIcon(item.mime)"
              />
              <span
                class="case-files__name"
                @click="openFileInNewTab(item)"
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
              v-if="!isReadOnly"
              :disabled="!editMode || !hasDeleteAccess"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
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
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import {
  useTableEmpty
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

const isReadOnly = inject('isReadOnly');
const store = useStore();

const { t } = useI18n();

const { hasCreateAccess, hasDeleteAccess } =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

const {
  namespace,
  dataList,
  selected,
  isLoading,
  headers,
  loadData,
  deleteData,
  setSelected,
  onFilterEvent,
} = useTableStore(props.namespace);

const {
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

const { showEmpty } = useTableEmpty({ dataList, isLoading });

const emptyText = computed(() => {
  return t('cases.attachments.emptyFilesText');
});
const filteredActions = computed(() => {
  return [IconAction.DOWNLOAD, ...(isReadOnly ? [] : [IconAction.ADD, IconAction.DELETE])]
})

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();
onUnmounted(() => {
  flushSubscribers();
});

const editMode = inject('editMode');

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
  for (const file of files) {
    await uploadFile(file);
  }

  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

const client = store.getters['CLIENT'];

async function uploadFile(uploadedFile) {
  try {
    const cliInstance = await client.getCliInstance();
    await cliInstance.storeFile(props.itemId, [uploadedFile], null, 'case');
  } finally {
    await loadData();
  }
}

function openFileDialog() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.addEventListener('change', handleFileInput);
  input.click();
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
  }
}
</style>
