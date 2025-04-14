<template>
  <section class="table-page">
    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <header class="table-title">
      <h3 class="table-title__title">
        {{ t('contacts.allContacts') }}
      </h3>

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
            v-if="isFTSConfigLoaded"
            :filters-manager="filtersManager"
            :is-filters-restoring="isFiltersRestoring"
            :search-mode-options="searchModeOptions"
            @filter:add="addFilter"
            @filter:update="updateFilter"
            @filter:delete="deleteFilter"
          />
        </template>
      </wt-action-bar>
    </header>

    <contacts-table>
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
import ContactsAPI from '@webitel/ui-sdk/api/clients/сontacts/contacts';
import { useAccessControl } from '@webitel/ui-sdk/composables/useAccessControl/useAccessControl';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useCardStore } from '@webitel/ui-sdk/store';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import ContactsTable from '../../../../../../../../_shared/modules/contacts/components/contacts-table.vue';
import { useContactsStore } from '../../../../../../../../_shared/modules/contacts/stores/contacts';

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

const tableStore = useContactsStore();

const {
  dataList,
  selected,
  isLoading,
  headers,
  page,
  size,
  next,
  error,
  filtersManager,
} = storeToRefs(tableStore);

const {
  addFilter,
  updateFilter,
  deleteFilter,
  deleteEls,
  initialize,
} = tableStore;

initialize();

async function loadContacts(params) {
  return await ContactsAPI.getLookup({
    ...params,
    groupId: itemInstance.value.group?.id,
  });
}
</script>

<style lang="scss" scoped>

</style>
