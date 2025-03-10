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
          :disabled:add="!hasCreateAccess || formState.isAdding || formState.editingComment"
          :include="[IconAction.ADD]"
          @click:add="startAddingComment"
        >
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
          :headers="shownHeaders"
          :selected="selected"
          headless
          :selectable="false"
          sortable
          @sort="updateSort"
          @update:selected="updateSelected"
        >
          <template #content="{ item }">
            <case-comment-row
              :comment="item"
            />
          </template>
          <template #actions="{ item }">
            <wt-icon-action
              v-if="item.canEdit"
              :disabled="!hasUpdateAccess || formState.isAdding"
              action="edit"
              @click="startEditingComment(item)"
            />
            <wt-icon-action
              v-if="item.canEdit"
              :disabled="!hasDeleteAccess"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteEls(item),
                })
              "
            />
          </template>
        </wt-table>

        <wt-pagination
          :next="next"
          :prev="page > 1"
          :size="size"
          debounce
          @change="updateSize"
          @next="updatePage(page + 1)"
          @prev="updatePage(page - 1)"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { IconAction, WtObject } from '@webitel/ui-sdk/src/enums/index';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import {storeToRefs} from "pinia";
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import TableTopRowBar from '../../../components/table-top-row-bar.vue';
import CommentsAPI from '../api/CommentsAPI';
import {useCaseCommentsStore} from "../stores/comments";
import CaseCommentRow from './case-comment-row.vue';

const props = defineProps({
  parentId: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl(WtObject.CaseComment);

const tableStore = useCaseCommentsStore();

const { dataList, selected, isLoading, page, size, next, shownHeaders } =
  storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
  deleteEls,
} = tableStore;

updateSize(5);
initialize({
  parentId: props.parentId,
});

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const { showEmpty } = useTableEmpty({ dataList, isLoading });

const emptyText = computed(() => {
  return t('cases.comments.emptyText');
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
  if (formState.editingComment) {
    await CommentsAPI.patch({
      commentId: formState.editingComment.etag,
      changes: { text: formState.commentText },
    });
  } else {
    await CommentsAPI.add({
      parentId: props.parentId,
      input: { text: formState.commentText },
    });
  }
  await loadDataList();
  resetForm();
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
