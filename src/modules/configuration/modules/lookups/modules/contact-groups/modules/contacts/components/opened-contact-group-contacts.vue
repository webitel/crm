<template>
  <section class="table-page">
    <add-contacts-in-group-popup
      :shown="isShowPopup"
      :group-ids="[itemInstance?.id]"
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
      :empty-data="{ primaryAction: () => isShowPopup = true }"
    >
      <template #action-bar>
        <wt-action-bar
          :disabled:add="!hasCreateAccess"
          :disabled:delete="!hasDeleteAccess || !selected.length"
          :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
          @click:add="isShowPopup = true"
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
          :disabled="!item.access.delete"
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
import { ContactGroupsAPI } from '@webitel/api-services/api';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { IconAction, WtObject } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useCardStore } from '@webitel/ui-sdk/store';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';

import ContactsTable from '../../../../../../../../_shared/modules/contacts/components/contacts-table.vue';
import AddContactsInGroupPopup from '../../add-contacts-in-group/components/add-contacts-in-group-popup.vue';
import { useContactsGroupContactsStore } from '../stores/contacts';

const props = defineProps<{
	namespace: string;
}>();

const { t } = useI18n();
const { hasCreateAccess, hasDeleteAccess } = useUserAccessControl(
	WtObject.Contact,
);
const { itemInstance } = useCardStore(props.namespace);

const isShowPopup = ref(false);

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useContactsGroupContactsStore();

const { selected, filtersManager, isFiltersRestoring } =
	storeToRefs(tableStore);

const { addFilter, updateFilter, deleteFilter, initialize, loadDataList } =
	tableStore;

const deleteEls = async (ids: string[]) => {
	await ContactGroupsAPI.removeContactsFromGroup({
		id: itemInstance.value?.id,
		contactIds: ids,
	});
	await loadDataList();
};

watch(
	() => itemInstance.value?.id,
	(val) => {
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
