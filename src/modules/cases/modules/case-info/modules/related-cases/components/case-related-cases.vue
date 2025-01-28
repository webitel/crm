<template>
  <delete-confirmation-popup
    :callback="deleteCallback"
    :delete-count="deleteCount"
    :shown="isConfirmationPopup"
    @close="closeDelete"
  />

  <div class="case-related-cases table-page">
    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('cases.relatedCases.relatedCases') }}
        </h3>

        <wt-action-bar
          :disabled:add="formState.mode !== null"
          :include="[IconAction.ADD]"
          @click:add="startAddingComment"
        >
          <wt-icon-btn
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

      <div
        v-if="formState.mode === 'create' || formState.mode === 'edit'"
        class="related-cases-form"
      >
        <wt-select
          :value="formState.relationType"
          :options="relatedTypesOptions"
          :clearable="false"
          :searchable="false"
          option-label="name"
          class="related-cases-form__select"
          @input="formState.relationType = $event"
        />

        <wt-select
          :value="formState.relatedCase"
          :clearable="false"
          :search-method="CasesAPI.getLookup"
          :placeholder="t('cases.relatedCases.searchCasesPlaceholder')"
          class="related-cases-form__input"
          @input="formState.relatedCase = $event"
        />

        <div class="related-cases-form__actions-wrapper">
          <wt-rounded-action
            class="related-cases-form__action"
            icon="tick"
            @click="submitComment"
          />

          <wt-rounded-action
            class="related-cases-form__action"
            icon="close"
            @click="resetForm"
          />
        </div>
      </div>

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
            <!--              :color="itemInstance.color"-->
            <color-component-wrapper
              color="red"
              component="wt-icon"
              icon="cases"
              size="xl"
            />
            {{ item.relatedCase.name }}
            {{ item.relationType }}
            <!--            <case-comment-item :comment="item" />-->
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              v-if="item.canEdit"
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

        <filter-pagination
          :is-next="isNext"
          :namespace="filtersNamespace"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { snakeToCamel } from '@webitel/ui-sdk/src/api/transformers/index.js';
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { computed, onUnmounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { CasesRelationType } from 'webitel-sdk';

import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';
import CasesAPI from '../../../../../api/CasesAPI.js';
import RelatedCasesAPI from '../api/related-cases.js';

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
  mode: null,
  isAdding: false,
  relatedCase: null,
  relationType: 'IS_BLOCKED_BY',
});

const relatedTypesOptions = computed(() =>
  Object.values(CasesRelationType).map((type) => {
    return {
      id: type,
      name: t(
        `cases.relatedCases.relationType.${snakeToCamel(type.toLowerCase())}`,
      ),
    };
  }),
);

function startAddingComment() {
  formState.mode = 'create';
  formState.editingComment = null;
  updateCommentText('');
}

function resetForm() {
  formState.mode = null;
  formState.relationType = null;
  formState.relatedCase = null;
}

function updateCommentText(value) {
  formState.commentText = value;
}

async function submitComment() {
  try {
    if (formState.editingComment) {
      await RelatedCasesAPI.patch({
        commentId: formState.editingComment.etag,
        changes: { text: formState.commentText },
      });
    } else {
      await RelatedCasesAPI.add({
        parentId: props.itemId,
        input: {
          relatedCase: {
            id: formState.relatedCase.id,
            name: formState.relatedCase.name,
          },
          relationType: formState.relationType,
        },
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
.case-related-cases {
  .related-cases-form {
    display: flex;
    gap: var(--spacing-xs);

    &__select {
      flex: 1;
    }

    &__input {
      flex: 2;
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
