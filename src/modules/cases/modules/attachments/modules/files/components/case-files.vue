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
            @click="
              askDeleteConfirmation({
                deleted: selected,
                callback: () => deleteData(selected),
              })
            "
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
            <div class="case-files__name-wrapper">
              <wt-icon :icon="getFileIcon(item.mime)" />
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
              :disabled="!editMode"
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
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { inject, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import downloadFile from '../../../../../../../app/utils/downloadFile.js';
import openFileInNewTab from '../../../../../../../app/utils/openFileInNewTab.js';
import getFileIcon from '../../../../../../../app/utils/fileTypeIcon.js';

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
  } catch (err) {
    throw err;
  } finally {
    loadData();
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
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__name {
    color: var(--info-color);
    cursor: pointer;

    &:hover {
      color: var(--info-hover-color);
    }
  }
}
</style>
