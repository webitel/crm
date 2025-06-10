<template>
  <div class="related-cases table-page">
    <delete-confirmation-popup
      :callback="deleteCallback"
      :delete-count="deleteCount"
      :shown="isConfirmationPopup"
      @close="closeDelete"
    />

    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('cases.relatedCases.relatedCases') }}
        </h3>

        <wt-action-bar
          v-if="!isReadOnly"
          :include="[IconAction.ADD, IconAction.DELETE]"
          :disabled:add="!hasCreateAccess || !editMode"
          :disabled:delete="!hasDeleteAccess || !editMode || !selected.length"
          @click:add="startAddingRelatedCase"
          @click:delete="
            askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteEls(selected),
            })
          "
        />
      </header>

      <table-top-row-bar
        v-if="hasCreateAccess && defaultState.createMode"
        @reset="resetForm"
        @submit="submitCase"
      >
        <wt-select
          :value="defaultState.relationType"
          :options="relatedTypesOptions"
          :clearable="false"
          :disabled="!hasCreateAccess"
          :searchable="false"
          use-value-from-options-by-prop="id"
          option-label="name"
          class="type-select"
          @input="defaultState.relationType = $event"
        />

        <wt-select
          :value="defaultState.relatedCase"
          :disabled="!hasCreateAccess"
          :clearable="false"
          :search-method="onRelatedCasesSearch"
          :placeholder="t('cases.relatedCases.searchCasesPlaceholder')"
          class="case-select"
          option-label="name"
          @input="defaultState.relatedCase = $event"
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
          :selectable="editMode"
          headless
          sortable
          @sort="updateSort"
          @update:selected="updateSelected"
        >

          <template #name="{ item }">
            <wt-item-link
              :link="getCaseLink(item)"
              target="_blank"
            >
              <div class="related-cases__item-wrapper">
                <color-component-wrapper
                  :color="getRevertedCase(item).color"
                  component="wt-icon"
                  icon="cases"
                  size="md"
                />

                <span>
                {{ getRevertedCase(item).name }}
              </span>
              </div>
            </wt-item-link>

          </template>

          <template #subject="{ item }">
            <wt-item-link
              :link="getCaseLink(item)"
              target="_blank"
            >
              {{ getRevertedCase(item).subject }}
            </wt-item-link>
          </template>

          <template #relationType="{ item }">
            {{
              t(
                `cases.relatedCases.relationType.${getRevertedCaseRelation(item)}`,
              )
            }}
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              v-if="!isReadOnly"
              :disabled="!hasDeleteAccess || !editMode"
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
        <div
          v-if="next"
          class="table-section-footer"
        >
          <a
            class="table-section-footer__link"
            @click="appendToDataList"
          >{{ t('reusable.more') }}</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import CrmSections from '@webitel/ui-sdk/enums/WebitelApplications/CrmSections.enum.js';
import { IconAction } from '@webitel/ui-sdk/src/enums/index';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import {
  useTableEmpty,
} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, inject, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { WebitelCasesRelationType } from 'webitel-sdk';

import ColorComponentWrapper from '../../../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import CasesAPI from '../../../api/CasesAPI';
import TableTopRowBar from '../../../components/table-top-row-bar.vue';
import { RelatedCasesAPI } from '../api/RelatedCasesAPI';
import { useCaseRelatedCasesStore } from '../stores/relatedCases';
import RelatedCaseItem from './related-case-item.vue';

const props = defineProps({
  parentId: {
    type: String,
    required: true,
  },
});

const isReadOnly = inject('isReadOnly');
const editMode = inject('editMode');

const { t } = useI18n();

const { hasCreateAccess, hasDeleteAccess } = useUserAccessControl({
  useUpdateAccessAsAllMutableChecksSource: true,
});

const tableStore = useCaseRelatedCasesStore();

const { dataList, error, selected, isLoading, shownHeaders, next } =
  storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
  updateSelected,
  updateSize,
  updateSort,
  deleteEls,
  appendToDataList,
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

const { showEmpty } = useTableEmpty({ dataList, error, isLoading });

const emptyText = computed(() => {
  return t('cases.relatedCases.emptyText');
});

const defaultState = reactive({
  createMode: false,
  isAdding: false,
  relatedCase: null,
  relationType: null,
});

const relatedTypesOptions = computed(() => {
  const types = Object.values(WebitelCasesRelationType).map((type) => {
    return {
      id: type,
      name: t(`cases.relatedCases.relationType.${type}`),
    };
  });
  return types.filter((el) => el.id !== 'RELATION_TYPE_UNSPECIFIED');
});

const onRelatedCasesSearch = async (params) => {
  return CasesAPI.getLookup({
    ...params,
    createdAtFrom: 0,
  });
};

function startAddingRelatedCase() {
  defaultState.createMode = true;
  defaultState.editingComment = null;
  defaultState.relationType = relatedTypesOptions.value[0].id;
}

function resetForm() {
  defaultState.createMode = false;
  defaultState.relationType = null;
  defaultState.relatedCase = null;
}

const isNeedToRevert = (item) => {
  return item.relatedCase.id === props.parentId;
};

function getRevertedCase(item) {
  return !isNeedToRevert(item) ? item.relatedCase : item.primaryCase;
}

const CASE_VIEW_NAME = 'case_view';
const createRouteLinkParams = (name, id) => {
  return {
    name,
    params: { id },
  };
};

function getCaseLink(item) {
  const revertedCase = getRevertedCase(item)
  if (isReadOnly) {
    return createRouteLinkParams(CASE_VIEW_NAME, revertedCase.etag);
  }
  return createRouteLinkParams(`${CrmSections.CASES}-card`, revertedCase.id);
}

// [https://webitel.atlassian.net/browse/WTEL-5492?focusedCommentId=655118]
// this is where the inversion is done after linking the related cases
const relationPairsMap = new Map([
  ['BLOCKS', 'IS_BLOCKED_BY'],
  ['CAUSES', 'IS_CAUSED_BY'],
  ['IS_CHILD_OF', 'IS_PARENT_OF'],
  ['DUPLICATES', 'IS_DUPLICATED_BY'],
]);

function getRevertedCaseRelation(item) {
  if (!isNeedToRevert(item)) {
    return item.relationType;
  }

  const inverseRelation = (type) =>
    relationPairsMap.get(type) ||
    [...relationPairsMap.entries()].find(([_, v]) => v === type)?.[0] ||
    type;

  return inverseRelation(item.relationType);
}

async function submitCase() {
  await RelatedCasesAPI.add({
    parentId: props.parentId,
    input: {
      relatedCase: {
        id: defaultState.relatedCase.id,
        name: defaultState.relatedCase.name,
      },
      relationType: defaultState.relationType,
    },
  });
  await loadDataList();
  resetForm();
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

  &__table {
    max-height: 210px;
    overflow-y: scroll;
  }

  &__item-wrapper {
    display: flex;
    align-items: start;
    width: 100%;
    grid-gap: var(--spacing-xs);
  }

  &__subject {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
}

.table-section-footer {
  margin: auto;

  &__link {
    color: var(--link-color);
    cursor: pointer;
  }
}
</style>
