<template>
  <section class="table-page">
    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <contacts-table :header="t('contacts.allContacts')" :table-store="tableStore">
      <template #action-bar>
        <wt-action-bar
          :disabled:add="!hasCreateAccess"
          :disabled:delete="!hasDeleteAccess"
          :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
          @click:add="() => {}"
          @click:delete="
          askDeleteConfirmation({
            deleted: selected,
            callback: () => deleteEls(selected),
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
              callback: () => deleteEls(item),
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
import { useCardStore } from '@webitel/ui-sdk/store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

import ContactsTable from '../../../../../../../../_shared/modules/contacts/components/contacts-table.vue';
import { useContactsGroupContactsStore } from '../stores/contacts';

const props = defineProps<{
  namespace: string,
}>();

const { t } = useI18n();
const { hasCreateAccess, hasDeleteAccess } = useAccessControl('contacts');

const { itemInstance } = useCardStore(
  props.namespace,
);

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
  deleteEls,
  initialize,
} = tableStore;

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

</style>
