<template>
  <section class="table-page">
    <add-contacts-in-group-popup
      :shown="isShowPopup"
      :group-ids="[groupId]"
      @load-data="loadDataList"
      @close="isShowPopup = false"
    />

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <contacts-table
      :header="t('contacts.allContacts', 2)"
      :table-store="tableStore"
      :empty-data="{ primaryAction: openAddPopup }"
    >
      <template #action-bar>
        <wt-action-bar
          :disabled:add="!hasCreateAccess || !groupId"
          :disabled:delete="!hasDeleteAccess || !selected.length || !groupId"
          :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
          @click:add="openAddPopup"
          @click:refresh="loadDataList"
          @click:delete="
          askDeleteConfirmation({
            deleted: selected,
            callback: () => deleteEls(selected.map(e => e.id)),
          })
        "
        >

          <template #search-bar>
            <dynamic-filter-search
              :filters-manager="filtersManager"
              :is-filters-restoring="isFiltersRestoring"
              @filter:add="addFilter"
              @filter:update="updateFilter"
              @filter:delete="deleteFilter"
            />
          </template>
        </wt-action-bar>
      </template>

      <template #actions="{ item }">
        <wt-icon-action
          :disabled="!getContactAccessFromMode(item.mode).delete"
          action="delete"
          @click="
            askDeleteConfirmation({
              deleted: [item],
              callback: () => deleteEls([item.id]),
            })
          "
        />
      </template>
    </contacts-table>
  </section>
</template>
<script setup lang="ts">
import {
	ContactGroupsAPI,
	getContactAccessFromMode,
} from '@webitel/api-services/api';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { IconAction, WtObject } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';

import ContactsTable from '../../../../../../../../contacts/_shared/components/contacts-table.vue';
import AddContactsInGroupPopup from '../../add-contacts-in-group/components/add-contacts-in-group-popup.vue';
import { useContactGroupContactsDatalistStore } from '../stores/datalist/contactGroupContactsDatalistStore';

const props = defineProps<{
	groupId?: string;
}>();

const { t } = useI18n();
const { hasCreateAccess, hasDeleteAccess } = useUserAccessControl(
	WtObject.Contact,
);

const isShowPopup = ref(false);

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useContactGroupContactsDatalistStore();

const { dataList, selected, filtersManager, isFiltersRestoring } =
	storeToRefs(tableStore);

const {
	addFilter,
	updateFilter,
	deleteFilter,
	initialize,
	loadDataList,
	updateSelected,
} = tableStore;

const openAddPopup = () => {
	if (!props.groupId) return;

	isShowPopup.value = true;
};

const deleteEls = async (ids: string[]) => {
	if (!props.groupId) return;

	await ContactGroupsAPI.removeContactsFromGroup({
		id: props.groupId,
		contactIds: ids,
	});
	await loadDataList();
};

watch(
	() => props.groupId,
	(val) => {
		// clear stale data from the previous group before switching/unsetting,
		// so a delete triggered mid-switch can never target the wrong group
		dataList.value = [];
		updateSelected([]);

		if (!val) {
			return;
		}

		initialize({
			parentId: val,
		});
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped>
.table-section {
  height: 100%;
}
</style>
