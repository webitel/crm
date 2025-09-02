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
          :disabled:add="isTableActionAddDisabled"
          :disabled:delete="isTableActionDeleteDisabled"
          :include="[IconAction.ADD, IconAction.DELETE]"
          @click:add="startAddingLink"
          @click:delete="
            askDeleteConfirmation({
              deleted: selected,
              callback: () => handleDeleteData(selected),
            })
          "
        >
        </wt-action-bar>
      </header>

      <table-top-row-bar
        v-if="isFormVisible"
        :disabled-add-action="isFormAddActionDisabled"
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
        v-show="showEmpty && !isPendingItemsLoading"
        :text="emptyText"
      />

      <wt-loader v-show="isLoading || isPendingItemsLoading" />

      <div
        v-show="isTableVisible"
        class="table-section__table-wrapper"
      >
        <wt-table
          :data="currentDataList"
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
            <template v-if="!isReadOnly">
              <wt-icon-action
                :disabled="isLinkEditActionDisabled"
                action="edit"
                @click="startEditingLink(item)"
              />
              <wt-icon-action
                :disabled="isLinkDeleteActionDisabled"
                action="delete"
                @click="
                  askDeleteConfirmation({
                    deleted: [item],
                    callback: () => handleDeleteData(item),
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
import { useCaseAttachments } from '../../../composables/useCaseAttachments.js';
import { AttachmentsTypes } from '../../../enums/AttachmentsTypes';
import LinksAPI from '../api/LinksAPI.js';

const props = defineProps({
  linksNamespace: {
    type: String,
    required: true,
  },
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
  namespace: linksTableNamespace,
  dataList,
  selected,
  isLoading,
  headers,
  loadData,
  deleteData,
  setSelected,
  onFilterEvent,
} = useTableStore(props.linksNamespace);

const {
  restoreFilters,
  subscribe,
  flushSubscribers,
} = useTableFilters(linksTableNamespace);

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const isTableActionAddDisabled = computed(() => {
  return !hasCreateAccess.value || formState.isAdding || formState.editingLink || !editMode.value || isPendingItemsLoading.value;
});

const isTableActionDeleteDisabled = computed(() => {
  return !editMode.value || !hasDeleteAccess.value || !selected.value.length || isPendingItemsLoading.value || isNew.value;
});

const isFormVisible = computed(() => {
  return hasUpdateAccess.value && (formState.isAdding || formState.editingLink);
});

const isFormAddActionDisabled = computed(() => {
  return isUrlInvalid.value || isPendingItemsLoading.value;
});

const isTableVisible = computed(() => {
  return !isLoading.value && currentDataList.value.length && !isPendingItemsLoading.value;
});

const isLinkEditActionDisabled = computed(() => {
  return !editMode.value || !hasUpdateAccess.value || formState.isAdding || isNew.value;
});

const isLinkDeleteActionDisabled = computed(() => {
  return !editMode.value || !hasDeleteAccess.value || isNew.value;
});

// Transform and process functions for links
const transformStoreItemToPending = (linkData) => ({
  name: linkData.input?.name || linkData.name,
  url: linkData.input?.url || linkData.url,
});

const addLink = async (link) => {
  await LinksAPI.add({
    parentId: props.itemId,
    input: {
      name: link.name,
      url: link.url,
    },
  });
};

const {
  isNew,
  pendingItems: pendingLinks,
  isPendingItemsLoading,
  addNewItem,
  handleDeleteData,
} = useCaseAttachments({
  cardNamespace: props.namespace,
  itemId: props.itemId,
  storePath: AttachmentsTypes.LINKS,
  loadData,
  transformStoreItemToPending,
  processItemToAPI: addLink,
  deleteData,
});

const currentDataList = computed(() => isNew.value ? pendingLinks.value : dataList.value);
const { showEmpty } = useTableEmpty({ dataList: currentDataList, isLoading });

const emptyText = computed(() => {
  return t('cases.attachments.emptyLinksText');
});

subscribe({
  event: '*',
  callback: (...args) => {
    if (!isNew.value) {
      onFilterEvent(...args);
    }
  },
});

if (!isNew.value) {
  restoreFilters();
}

onUnmounted(() => {
  flushSubscribers();
});

// Form state for links
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
    // Handle editing existing link
    await updateExistingLink(editingLink, name, linkUrl);
  } else {
    // Handle creating new link - use composable
    const linkData = { name, url: linkUrl };
    const storeData = { input: { name, url: linkUrl } };
    await addNewItem(linkData, storeData);
  }

  resetForm();
}

async function updateExistingLink(editingLink, name, linkUrl) {
  await LinksAPI.patch({
    parentId: props.itemId,
    linkId: editingLink.etag,
    changes: {
      name,
      url: linkUrl,
    },
  });
  await loadData();
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
