<template>
  <delete-confirmation-popup
    :callback="deleteCallback"
    :delete-count="deleteCount"
    :shown="isConfirmationPopup"
    @close="closeDelete"
  />

  <div class="related-cases table-page">
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

      <table-top-row-bar
        v-if="formState.mode === 'create' || formState.mode === 'edit'"
        @reset="resetForm"
        @submit="submitCase"
      >
        <wt-select
          :value="formState.relationType"
          :options="relatedTypesOptions"
          :clearable="false"
          :searchable="false"
          use-value-from-options-by-prop="id"
          option-label="name"
          class="type-select"
          @input="formState.relationType = $event"
        />

        <wt-select
          :value="formState.relatedCase"
          :clearable="false"
          :search-method="CasesAPI.getLookup"
          :placeholder="t('cases.relatedCases.searchCasesPlaceholder')"
          class="case-select"
          option-label="name"
          @input="formState.relatedCase = $event"
        >
          <template #option="{ option }">
            <related-case-item
              :color="option.priority?.color"
              :name="option.name"
              :subject="option.subject"
            />
          </template>
        </wt-select>
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
            <!--              :color="itemInstance.color"-->
            <related-case-item
              color="red"
              :name="item.relatedCase.name"
              :subject="item.relatedCase.subject"
              :relation-type="getRelatedTypeTranslate(item.relationType)"
            />
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              :disabled="!props.editMode"
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
import { IconAction } from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/index.js';
import { computed, onUnmounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { CasesRelationType } from 'webitel-sdk';

import CasesAPI from '../../../../../api/CasesAPI.js';
import TableTopRowBar from '../../../../../components/table-top-row-bar.vue';
import RelatedCasesAPI from '../api/related-cases.js';
import RelatedCaseItem from './related-case-item.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    required: true,
  },
});

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
  relationType: null,
});

function getRelatedTypeTranslate(type) {
  const convertedType = objSnakeToCamel([type.toLowerCase()])[0];
  return t(`cases.relatedCases.relationType.${convertedType}`);
}

const relatedTypesOptions = computed(() =>
  Object.values(CasesRelationType).map((type) => {
    return {
      id: type,
      name: getRelatedTypeTranslate(type),
    };
  }),
);

function startAddingComment() {
  formState.mode = 'create';
  formState.editingComment = null;
  formState.relationType = relatedTypesOptions.value[0].id;
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

async function submitCase() {
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
.related-cases {
  .type-select {
    flex: 1;
  }

  .case-select {
    flex: 2;

    &__option {
      display: flex;
      align-items: start;

      &-name {
        margin-left: var(--spacing-xs);
      }

      &-subject {
        margin-left: var(--space-lg);
      }
    }
  }
}
</style>
