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
        <h3 class="case-section-title">
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
              callback: () => handleBulkDelete(selected),
            })
          "
        >
        </wt-action-bar>
      </header>

      <wt-inline-add-panel
        v-if="isFormVisible"
        :disabled-add-action="isFormAddActionDisabled"
        @reset="resetForm"
        @submit="submitLink"
      >
        <template>
        <wt-input-text
          :placeholder="t('cases.attachments.url')"
          :model-value="formState.linkUrl"
          class="link-form__input"
          @update:model-value="updateLinkUrl"
        />
        <wt-input-text
          :placeholder="t('cases.attachments.linkText')"
          :model-value="formState.linkText"
          class="link-form__input"
          @update:model-value="updateLinkText"
        />
          </template>
      </wt-inline-add-panel>

      <wt-empty
        v-show="showEmpty && !isPendingItemsLoading"
        :text="t('cases.attachments.emptyLinksText')"
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
          :selectable="isEditable"
          headless
          @update:selected="updateSelected"
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
                    callback: () => handleLinkDelete(item),
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

<script setup lang="ts">
import { CaseLinksAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { WtInlineAddPanel } from '@webitel/ui-sdk/components';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../../../stores/card/casesCardStore';
import { useCaseAttachments } from '../../../composables/useCaseAttachments';
import { AttachmentsTypes } from '../../../enums/AttachmentsTypes';
import { useCaseLinksDatalistStore } from '../stores/datalist/caseLinksDatalistStore';

const props = defineProps<{
	itemId: string;
}>();

const { isEditable, isReadOnly } = useCaseAccessState();
const { modelValue, isNew } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});

const { t } = useI18n();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl({
		useUpdateAccessAsAllMutableChecksSource: true,
	});

const linksStore = useCaseLinksDatalistStore();
const {
	dataList,
	selected,
	isLoading,
	shownHeaders: headers,
} = storeToRefs(linksStore);
const { loadDataList, deleteEls, updateSelected, updateSize, initialize } =
	linksStore;

const {
	isVisible: isConfirmationPopup,
	deleteCount,
	deleteCallback,
	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const isTableActionAddDisabled = computed(() => {
	return (
		!hasCreateAccess.value ||
		formState.isAdding ||
		formState.editingLink ||
		!isEditable.value ||
		isPendingItemsLoading.value
	);
});

const isTableActionDeleteDisabled = computed(() => {
	return (
		!isEditable.value ||
		!hasDeleteAccess.value ||
		!selected.value.length ||
		isPendingItemsLoading.value
	);
});

const isFormVisible = computed(() => {
	return hasUpdateAccess.value && (formState.isAdding || formState.editingLink);
});

const isFormAddActionDisabled = computed(() => {
	return isUrlInvalid.value || isPendingItemsLoading.value;
});

const isTableVisible = computed(() => {
	return (
		!isLoading.value &&
		currentDataList.value.length &&
		!isPendingItemsLoading.value
	);
});

const isLinkEditActionDisabled = computed(() => {
	return !isEditable.value || !hasUpdateAccess.value || formState.isAdding;
});

const isLinkDeleteActionDisabled = computed(() => {
	return !isEditable.value || !hasDeleteAccess.value;
});

// Transform and process functions for links
const transformStoreItemToPending = (linkData) => ({
	name: linkData.input?.name || linkData.name,
	url: linkData.input?.url || linkData.url,
});

const addLink = async (link) => {
	await CaseLinksAPI.add({
		parentId: props.itemId,
		input: {
			name: link.name,
			url: link.url,
		},
	});
};

const {
	pendingItems: pendingLinks,
	isPendingItemsLoading,
	addNewItem,
	handleDeleteData,
	deletePendingItem,
	updatePendingItem,
	deleteMultiplePendingItems,
} = useCaseAttachments({
	itemInstance: modelValue,
	isNew,
	storePath: AttachmentsTypes.Links,
	loadData: loadDataList,
	transformStoreItemToPending,
	processItemToAPI: addLink,
	deleteData: deleteEls,
});

const currentDataList = computed(() =>
	isNew.value ? pendingLinks.value : dataList.value,
);
const { showEmpty } = useTableEmpty({
	dataList: currentDataList,
	isLoading,
});

updateSize(100);
if (!isNew.value) {
	initialize({
		parentId: props.itemId,
	});
}

// Form state for links
const formState = reactive({
	isAdding: false,
	editingLink: null,
	linkText: '',
	linkUrl: '',
});

function isValidUrl(value: string) {
	try {
		return [
			'http:',
			'https:',
			'ftp:',
		].includes(new URL(value).protocol);
	} catch {
		return false;
	}
}

const isUrlInvalid = computed(
	() => formState.isAdding && !isValidUrl(formState.linkUrl),
);

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
		// Handle editing existing or pending link
		await handleLinkEdit(editingLink);
	} else {
		// Handle creating new link - use composable
		const linkData = {
			name,
			url: linkUrl,
		};
		const storeData = {
			input: {
				name,
				url: linkUrl,
			},
		};
		await addNewItem(linkData, storeData);
	}

	resetForm();
}

async function updateExistingLink(editingLink, name, linkUrl) {
	await CaseLinksAPI.patch({
		parentId: props.itemId,
		linkId: editingLink.etag,
		changes: {
			name,
			url: linkUrl,
		},
	});
	await loadDataList();
}

// Function to handle deletion of pending links
async function handleLinkDelete(link) {
	await (isNew.value ? deletePendingItem(link) : handleDeleteData(link));
}

// Function to handle editing of pending links
async function handleLinkEdit(link) {
	await (isNew.value
		? updatePendingItem(link, {
				name: formState.linkText,
				url: formState.linkUrl,
			})
		: updateExistingLink(link, formState.linkText, formState.linkUrl));
}

// Function to handle bulk deletion of links (pending or existing)
async function handleBulkDelete(links) {
	await (isNew.value
		? deleteMultiplePendingItems(links)
		: handleDeleteData(links));
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

  .link-form__input {
    flex: 1;
  }
}
</style>
