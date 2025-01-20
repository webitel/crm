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
          :include="[IconAction.ADD]"
          :disabled:add="addingCommentMode || editingComment"
          @click:add="startAddingComment"
        >
          <wt-icon-btn
            class="icon-action"
            icon="bucket"
          />
        </wt-action-bar>
      </header>
      <div
        v-if="addingCommentMode || editingComment"
        class="comment-form"
      >
        <wt-input
          class="comment-form__input"
          v-model="commentText"
          :placeholder="addingCommentMode
            ? t('cases.comments.yourCommentHere')
            : t('cases.comments.editYourComment')"
        />
        <div class="comment-form__actions-wrapper">
          <wt-rounded-action
            class="comment-form__action"
            icon="tick"
            @click="submitComment"
          />
          <wt-rounded-action
            class="comment-form__action"
            icon="close"
            @click="cancelComment"
          />
        </div>
      </div>
      <wt-loader v-show="isLoading" />
      <div
        v-show="!isLoading && dataList.length"
        class="table-section__table-wrapper"
      >
        <wt-table
          headless
          :data="dataList"
          :headers="headers"
          :selected="selected"
          sortable
          @sort="sort"
          @update:selected="setSelected"
        >
          <template #content="{ item }">
            <div class="case-comment">
              <div class="case-comment__icon">
                <wt-icon
                  icon="cases"
                />
              </div>
              <div class="case-comment__wrapper">
                <div class="case-comment__header">
                  <div class="case-comment__author">
                    <wt-item-link
                      :link="{ name: `${CrmSections.CONTACTS}-card`, params: { id: item.author.id } }"
                      class="case-comment__author-link"
                      target="_blank"
                    >
                      {{ item.author.name }}
                    </wt-item-link>
                  </div>
                  <div class="case-comment__date">
                    {{ prettifyDate(item.createdAt) }}
                  </div>
                  <div
                    v-if="item.edited"
                    class="case-comment__edited"
                  >
                    {{ t('cases.comments.edited') }}
                  </div>
                </div>
                <div class="case-comment__text">
                  {{ item.text }}
                </div>
              </div>
            </div>
          </template>
          <template #actions="{ item }">
            <wt-icon-action
              :disabled="addingCommentMode"
              action="edit"
              @click="startEditingComment(item)"
            />
            <wt-icon-action
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
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import prettifyDate from '../../../../../utils/prettifyDate.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { ref, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import CommentsAPI from '../api/CommentsAPI.js';

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

const addingCommentMode = ref(false);
const editingComment = ref(null);
const commentText = ref('');

function startAddingComment() {
  addingCommentMode.value = true;
  commentText.value = '';
}

function startEditingComment(comment) {
  editingComment.value = comment;
  commentText.value = comment.text;
}

function cancelComment() {
  addingCommentMode.value = false;
  editingComment.value = null;
  commentText.value = '';
}

async function submitComment() {
  //TODO: refactor API usage after API is ready
  try {
    if (editingComment.value) {
      await CommentsAPI.update(editingComment.value.id, {
        text: commentText.value,
      });
    } else {
      await CommentsAPI.add({ text: commentText.value });
    }
    await loadData();
    cancelComment();
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
}
</script>

<style lang="scss" scoped>
.case-comments {
  .case-comment {
    display: flex;
    gap: var(--spacing-xs);

    &__header, &__wrapper {
      display: flex;
      gap: var(--spacing-xs);
    }

    &__wrapper {
      flex-direction: column;
    }

    &__author-link {
      //TODO: use typo-body bold when it's ready
      @extend %typo-body-1;
      font-weight: bold;
      color: var(--link-color);
    }
  }

  .comment-form {
    display: flex;
    gap: var(--spacing-xs);

    &__input {
      flex: 1;
    }

    &__actions-wrapper {
      display: flex;
      gap: var(--spacing-xs);
    }

    &__action {
      padding: var(--spacing-xs);
    }
  }
}
</style>
