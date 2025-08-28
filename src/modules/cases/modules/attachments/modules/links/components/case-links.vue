<template>
  <delete-confirmation-popup
    :callback="deleteCallback"
    :delete-count="deleteCount"
    :shown="isConfirmationPopup"
    @close="closeDelete"
  />

  <div class="case-links table-page">
    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('cases.attachments.links') }}
        </h3>
        <wt-action-bar
          v-if="!isReadOnly"
          :disabled:add="!hasCreateAccess || formState.isAdding || formState.editingLink || !editMode"
          :disabled:delete="!editMode || !hasDeleteAccess || !selected.length"
          :include="[IconAction.ADD, IconAction.DELETE]"
          @click:add="startAddingLink"
          @click:delete="
            askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteData(selected),
            })
          "
        >
        </wt-action-bar>
      </header>

      <table-top-row-bar
        v-if="hasUpdateAccess && (formState.isAdding || formState.editingLink)"
        :disabled-add-action="isUrlInvalid"
        @reset="resetForm"
        @submit="submitLink"
      >
        <wt-input
          :placeholder="t('cases.attachments.url')"
          :value="formState.linkUrl"
          :v="v$.linkUrl"
          class="link-form__input"
          @input="updateLinkUrl"
        />
        <wt-input
          :placeholder="t('cases.attachments.linkText')"
          :value="formState.linkText"
          class="link-form__input"
          @input="updateLinkText"
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
          :headers="headers"
          :selected="selected"
          :selectable="editMode"
          headless
          @update:selected="setSelected"
        >
          <template #name="{ item }">
            <a
              class="case-links__link"
              :href="item?.url"
              target="_blank"
            >
              <wt-icon
                class="case-links__link-icon"
                icon="link"
              />
              <span>
                {{ item?.name || item?.url }}
              </span>
            </a>
          </template>

          <template #createdBy="{ item }">
            {{ item?.createdBy?.name }}
          </template>

          <template #actions="{ item }">
            <template
              v-if="!isReadOnly"
            >
              <wt-icon-action
                :disabled="!editMode || !hasUpdateAccess || formState.isAdding"
                action="edit"
                @click="startEditingLink(item)"
              />
              <wt-icon-action
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
          </template>
        </wt-table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, url } from '@vuelidate/validators';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { computed, inject, onUnmounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import TableTopRowBar from '../../../../../components/table-top-row-bar.vue';
import LinksAPI from '../api/LinksAPI.js';

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
const editMode = inject('editMode');

const { t } = useI18n();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } = useUserAccessControl({
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
  return t('cases.attachments.emptyLinksText');
});

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
  editingLink: null,
  linkText: '',
  linkUrl: '',
});

function requiredIfIsAdding(value, state, siblings) {
  if (!formState.isAdding) {
    return true;
  }

  return required.$validator(value, state, siblings);
}

const rules = computed(() => ({
  linkUrl: { requiredIfIsAdding, url },
}));

const v$ = useVuelidate(rules, formState);

v$.value.$touch();

const isUrlInvalid = computed(() => v$.value.linkUrl.$invalid);

function startAddingLink() {
  formState.isAdding = true;
  formState.editingLink = null;
  updateLinkText('');
  updateLinkUrl('');
}

function startEditingLink(link) {
  formState.isAdding = false;
  formState.editingLink = link;
  updateLinkText(link.name);
  updateLinkUrl(link.url);
}

function resetForm() {
  formState.isAdding = false;
  formState.editingLink = null;
  updateLinkText('');
  updateLinkUrl('');
}

function updateLinkText(value) {
  formState.linkText = value;
}

function updateLinkUrl(value) {
  formState.linkUrl = value;
}

async function submitLink() {
  const { editingLink, linkText, linkUrl } = formState;
  const name = linkText || linkUrl;

  if (editingLink) {
    await LinksAPI.patch({
      parentId: props.itemId,
      linkId: editingLink.etag,
      changes: {
        name: name,
        url: linkUrl,
      },
    });
  } else {
    await LinksAPI.add({
      parentId: props.itemId,
      input: {
        name: name,
        url: linkUrl,
      },
    });
  }
  await loadData();
  resetForm();
}
</script>

<style lang="scss" scoped>
.case-links {
  &__link {
    display: flex;
    gap: var(--spacing-xs);
    color: var(--link-color);
    cursor: pointer;

    &:hover {
      color: var(--link--hover-color);
    }
  }

  &__link-icon {
    flex-shrink: 0;
  }

  .link-form {
    &__input {
      flex: 1;
    }
  }
}
</style>
