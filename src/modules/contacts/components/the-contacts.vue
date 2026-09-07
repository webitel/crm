<template>
  <wt-page-wrapper
    :actions-panel="false"
    class="contacts"
  >
    <template #header>
      <contact-popup
        :id="editedContactId"
        :shown="isContactPopup"
        @close="closeContactPopup"
        @saved="saved"
      />

      <wt-breadcrumb :path="path" />
    </template>

    <template #main>
      <section class="table-page">
        <delete-confirmation-popup
          :shown="isDeleteConfirmationPopup"
          :callback="deleteCallback"
          :delete-count="deleteCount"
          @close="closeDelete"
        />

        <contacts-table
          :header="t('contacts.contact', 2)"
          :table-store="tableStore"
          :empty-data="{ primaryAction: create }"
        >
          <template #action-bar>
            <wt-action-bar
              :disabled:add="!hasCreateAccess"
              :disabled:delete="!hasDeleteAccess || !deletableSelectedItems.length"
              :include="[IconAction.ADD, IconAction.FILTERS, IconAction.REFRESH, IconAction.DELETE]"
              @click:add="create"
              @click:refresh="loadDataList"
              @click:delete="deleteSelectedItems"
            >

              <!-- no filters panel here: reset (and presets, if any) live in the icon's menu -->
              <template #filters>
                <filters-actions-menu
                  :filters-manager="filtersManager"
                  :filter-options="filtersOptions"
                  @filter:reset-all="resetFilters"
                />
              </template>
              <template #search-bar>
                <dynamic-filter-search
                  :filters-manager="filtersManager"
                  :is-filters-restoring="isFiltersRestoring"
                  :search-mode-options="searchModeOpts"
                  :search-mode="searchMode"
                  @filter:add="addFilter"
                  @filter:update="updateFilter"
                  @filter:delete="deleteFilter"
                  @update:search-mode="updateSearchMode"
                />
              </template>
            </wt-action-bar>
          </template>

          <!-- filters live in the column headers only, there is no filters panel on this page -->
          <template #column-filter="{ header, hide }">
            <column-filter
              :header="header"
              :filters-manager="filtersManager"
              :filter-options="filtersOptions"
              @add:filter="addFilter"
              @update:filter="updateFilter"
              @delete:filter="deleteFilter"
              @close="hide"
            />
          </template>
          <template #column-filter-preview="{ header }">
            <column-filter-preview
              :header="header"
              :filters-manager="filtersManager"
              :filter-options="filtersOptions"
            />
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              :disabled="!getContactAccessFromMode(item.mode).edit"
              action="edit"
              @click="edit(item)"
            />

            <wt-icon-action
              :disabled="!getContactAccessFromMode(item.mode).delete"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteEls(item),
                })
                "
            />
          </template>
        </contacts-table>
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script setup lang="ts">
import {
	ContactsSearchMode,
	getContactAccessFromMode,
} from '@webitel/api-services/api';
import {
	ColumnFilterComponent as ColumnFilter,
	ColumnFilterPreviewComponent as ColumnFilterPreview,
	DynamicFilterSearchComponent as DynamicFilterSearch,
	FiltersActionsMenuComponent as FiltersActionsMenu,
} from '@webitel/ui-datalist/filters';
import { CrmSections, IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import variableSearchValidator from '@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import ContactsTable from '../_shared/components/contacts-table.vue';
import { filtersOptions } from '../configs/filtersOptions';
import { useContactsDatalistStore } from '../stores/datalist/contactsDatalistStore';
import ContactPopup from './contact-popup.vue';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasDeleteAccess } = useUserAccessControl();

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useContactsDatalistStore();

const { selected, filtersManager, isFiltersRestoring, searchMode } =
	storeToRefs(tableStore);

const {
	initialize,
	deleteEls,
	loadDataList,
	addFilter,
	updateFilter,
	deleteFilter,
	updateSearchMode,
} = tableStore;

// search filters live in the same manager, keep them
const resetFilters = () => {
	filtersManager.value.reset({
		exclude: Object.values(ContactsSearchMode),
	});
};

const isContactPopup = ref(false);
const editedContactId = ref(null);

const path = computed(() => [
	{
		name: t('crm'),
		route: '/start-page',
	},
	{
		name: t('contacts.contact', 2),
	},
]);

const searchModeOpts = computed(() => [
	{
		value: ContactsSearchMode.NAME,
		text: t('reusable.name'),
	},
	{
		value: ContactsSearchMode.LABELS,
		text: t('vocabulary.labels', 1),
	},
	{
		value: ContactsSearchMode.ABOUT,
		text: t('vocabulary.description'),
	},
	{
		value: ContactsSearchMode.VARIABLES,
		text: t('contacts.attributes', 1),
		hint: t('webitelUI.searchBar.variableSearchHint'),
		v: {
			variableSearchValidator,
		},
	},
	{
		value: ContactsSearchMode.DESTINATION,
		text: t('contacts.destination'),
	},
]);

const deletableSelectedItems = computed(() =>
	selected.value.filter((item) => getContactAccessFromMode(item.mode).delete),
);

function create() {
	isContactPopup.value = true;
}

function edit({ id }) {
	editedContactId.value = id;
	isContactPopup.value = true;
}

function saved(id) {
	return router.push({
		name: `${CrmSections.Contacts}-card`,
		params: {
			id,
		},
	});
}

function closeContactPopup() {
	isContactPopup.value = false;
	editedContactId.value = null;
}

function deleteSelectedItems() {
	return askDeleteConfirmation({
		deleted: deletableSelectedItems.value,
		callback: () =>
			deleteEls([
				...deletableSelectedItems.value,
			]),
	});
}

initialize();
</script>

<style
  lang="scss"
  scoped
>
.table-page {
  width: 100%;

  .table-section {
    height: 100%;
  }
}
</style>
