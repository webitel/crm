<template>
  <delete-confirmation-popup
    :callback="deleteCallback"
    :delete-count="deleteCount"
    :shown="isConfirmationPopup"
    @close="closeDelete"
  />

  <div class="case-comments table-page">
    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('cases.comments.comments') }}
        </h3>
        <wt-action-bar
          :disabled:add="formState.isAdding || formState.editingComment"
          :include="[IconAction.ADD]"
          @click:add="startAddingComment"
        >
          <wt-icon-btn
            class="icon-action"
            icon="bucket"
            @click="askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteData(selected),
            })"
          />
        </wt-action-bar>
      </header>

      <table-top-row-bar
        v-if="formState.isAdding || formState.editingComment"
        @reset="resetForm"
        @submit="submitComment"
      >
        <wt-input
          :placeholder="t('cases.comments.yourCommentHere')"
          :value="formState.commentText"
          class="comment-form__input"
          @input="updateCommentText"
        />
      </table-top-row-bar>

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
          sortable
          @sort="sort"
          @update:selected="setSelected"
        >
          <template #content="{ item }">
            <case-comment-item :comment="item" />
          </template>
          <template #actions="{ item }">
            <wt-icon-action
              v-if="item.canEdit"
              :disabled="formState.isAdding"
              action="edit"
              @click="startEditingComment(item)"
            />
            <wt-icon-action
              v-if="item.canEdit"
              action="delete"
              @click="askDeleteConfirmation({
                deleted: [item],
                callback: () => deleteData(item),
              })"
            />
          </template>
        </wt-table>

        <filter-pagination
          :is-next="isNext"
          :namespace="filtersNamespace"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { onUnmounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import TableTopRowBar from '../../../../../components/table-top-row-bar.vue';
import CommentsAPI from '../api/CommentsAPI.js';
import CaseCommentItem from './case-comment-item.vue';

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

const formState = reactive({
  isAdding: false,
  editingComment: null,
  commentText: '',
});

function startAddingComment() {
  formState.isAdding = true;
  formState.editingComment = null;
  updateCommentText('');
}

function startEditingComment(comment) {
  formState.isAdding = false;
  formState.editingComment = comment;
  updateCommentText(comment.text);
}

function resetForm() {
  formState.isAdding = false;
  formState.editingComment = null;
  updateCommentText('');
}

function updateCommentText(value) {
  formState.commentText = value;
}

async function submitComment() {
  try {
    if (formState.editingComment) {
      await CommentsAPI.patch({
        commentId: formState.editingComment.etag,
        changes: { text: formState.commentText },
      });
    } else {
      await CommentsAPI.add({
        parentId: props.itemId,
        input: { text: formState.commentText },
      });
    }
    await loadData();
    resetForm();
  } catch (error) {
    throw error;
  }
}
</script>

<style lang="scss" scoped>
.case-comments {
  .comment-form {
    &__input {
      flex: 1;
    }
  }
}
</style>
