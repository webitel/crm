<template>
  <wt-page-wrapper
    :actions-panel="showActionsPanel"
    class="contacts"
  >
    <template #header>
      <contact-popup
        :id="editedContactId"
        :shown="isContactPopup"
        :namespace="ContactsNamespace"
        @close="closeContactPopup"
        @saved="saved"
      />

      <wt-page-header
        :primary-action="create"
        :primary-disabled="!hasCreateAccess"
        :secondary-action="deleteSelectedItems"
        :secondary-disabled="!hasDeleteAccess || !deletableSelectedItems.length"
        :secondary-text="$t('reusable.delete')"
      >
        <wt-headline-nav :path="path" />

        <template #actions>
          <!-- TODO -->
        </template>
      </wt-page-header>
    </template>

    <template #actions-panel>
      <contacts-filters-panel @hide="showActionsPanel = false" />
    </template>

    <template #main>
      <delete-confirmation-popup
        :shown="isDeleteConfirmationPopup"
        :callback="deleteCallback"
        :delete-count="deleteCount"
        @close="closeDelete"
      />

      <contacts-table :header="t('contacts.contact', 2)" :table-store="tableStore">
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
              <!-- TODO -->
            </template>
          </wt-action-bar>
        </template>

        <template #actions="{ item }">
          <wt-icon-action
            :disabled="!item.access.edit"
            action="edit"
            @click="edit(item)"
          />

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
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { IconAction } from '@webitel/ui-sdk/enums';
import ContactsSearchMode from '@webitel/ui-sdk/src/api/clients/сontacts/enums/ContactsSearchMode.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import variableSearchValidator from '@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import ContactsTable from '../../_shared/modules/contacts/components/contacts-table.vue';
import { ContactsNamespace } from '../namespace';
import { useContactsStore } from '../stores/contacts';
import ContactPopup from './contact-popup.vue';
import ContactsFiltersPanel from './contacts-filters-panel.vue';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasDeleteAccess } = useAccessControl('contacts');

const showActionsPanel = ref(true);

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useContactsStore();

const {
  selected,
  deleteData,
} = storeToRefs(tableStore);

const {
  initialize,
  deleteEls,
} = tableStore;

const isContactPopup = ref(false);
const editedContactId = ref(null);

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('contacts.contact', 2) },
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
    v: { variableSearchValidator },
  },
  {
    value: ContactsSearchMode.DESTINATION,
    text: t('contacts.destination'),
  },
]);

const deletableSelectedItems = computed(() =>
  selected.value.filter((item) => item.access.delete),
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
    name: `${CrmSections.CONTACTS}-card`,
    params: { id },
  });
}

function closeContactPopup() {
  isContactPopup.value = false;
  editedContactId.value = null;
}

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: deletableSelectedItems.value,
    callback: () => deleteData([...deletableSelectedItems.value]),
  });
}

initialize()
</script>

<style lang="scss" scoped>

</style>
