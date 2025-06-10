<template>
  <section class="table-page">
    <add-contacts-in-group-popup
      :group-ids="[itemInstance?.id]"
      @load-data="loadDataList"
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
      :empty-data="{ primaryAction: addContactInGroup }"
    >
      <template #action-bar>
        <wt-action-bar
          :disabled:add="!hasCreateAccess"
          :disabled:delete="!hasDeleteAccess || !selected.length"
          :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
          @click:add="addContactInGroup"
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
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { useAccessControl } from '@webitel/ui-sdk/composables/useAccessControl/useAccessControl';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { contactGroups } from '@webitel/ui-sdk/src/api/clients/index';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import ContactsTable from '../../../../../../../../_shared/modules/contacts/components/contacts-table.vue';
import AddContactsInGroupPopup from '../../add-contacts-in-group/components/add-contacts-in-group-popup.vue';
import { useContactsGroupContactsStore } from '../stores/contacts';

const props = defineProps<{
  namespace: string,
}>();

const { t } = useI18n();
const { hasCreateAccess, hasDeleteAccess } = useAccessControl('contacts');
const { itemInstance } = useCardStore(
  props.namespace,
);

const router = useRouter();

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useContactsGroupContactsStore();

const {
  selected,
  filtersManager,
  isFiltersRestoring,
} = storeToRefs(tableStore);

const {
  addFilter,
  updateFilter,
  deleteFilter,
  initialize,
  loadDataList,
} = tableStore;

const deleteEls = async (ids: string[]) => {
  await contactGroups.removeContactsFromGroup({id: itemInstance.value?.id, contactIds: ids })
  await loadDataList()
}

const addContactInGroup = () => {
  return router.push({
    name: `${CrmSections.CONTACT_GROUPS}-contacts-list`,
  });
}

watch(() => itemInstance.value?.id, (val) => {
  if (!val) {
    return;
  }

  initialize({
    parentId: val,
  });
}, {
  immediate: true,
});
</script>

<style lang="scss" scoped>
.table-section {
  height: 100%;
}
</style>
