<template>
  <wt-page-wrapper
    class="contacts"
    :actions-panel="false"
  >
    <template v-slot:header>
      <contact-popup
        v-if="isContactPopup"
        :namespace="baseNamespace"
        :id="editedContactId"
        @saved="loadData"
        @close="closeContactPopup"
      ></contact-popup>

      <wt-page-header
        :primary-action="create"
        :secondary-text="$t('reusable.delete')"
        :secondary-action="deleteSelectedItems"
        :secondary-disabled="!hasObacDeleteAccess || !deletableSelectedItems.length"
        :primary-disabled="!hasObacCreateAccess"
      >
        <wt-headline-nav :path="path"></wt-headline-nav>
        <template v-slot:actions>
          <filter-search
            :namespace="filtersNamespace"
          ></filter-search>
        </template>
      </wt-page-header>
    </template>
    <template v-slot:main>
      <wt-loader v-show="isLoading"></wt-loader>

      <wt-dummy
        v-if="!isLoading && dummy"
        :src="dummy.src"
      ></wt-dummy>

      <delete-confirmation-popup
        v-show="isDeleteConfirmationPopup"
        :delete-count="deleteCount"
        :callback="deleteCallback"
        @close="closeDelete"
      ></delete-confirmation-popup>

      <div v-show="!isLoading && !dummy" class="table-wrapper">
        <wt-table
          :headers="headers"
          :data="dataList"
          sortable
          @sort="sort"
        >
          <template v-slot:name="{ item }">
            <div class="username-wrapper">
              <wt-avatar
                size="sm"
                :username="item.name.commonName"
              ></wt-avatar>
              <wt-item-link
                :id="item.id"
                :route-name="CrmSections.CONTACTS"
              >
                {{ item.name.commonName }}
              </wt-item-link>
            </div>
          </template>
          <template v-slot:managers="{ item }">
            {{ item.managers?.data[0].user.name }}
          </template>
          <template v-slot:labels="{ item }">
            <div
              v-if="item.labels"
              class="contacts-labels-wrapper"
            >
              <wt-chip
                v-for="({ label, id }) of item.labels.data"
                :key="id"
              >{{ label }}
              </wt-chip>
            </div>
          </template>
          <template v-slot:actions="{ item }">
            <wt-icon-action
              :disabled="!item.access.edit"
              action="edit"
              @click="edit(item)"
            ></wt-icon-action>
            <wt-icon-action
              :disabled="!item.access.delete"
              action="delete"
              @click="askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
                })"
            ></wt-icon-action>
          </template>
        </wt-table>
        <filter-pagination
          :namespace="filtersNamespace"
          :is-next="isNext"
        ></filter-pagination>
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useAccess } from '../../../app/composables/useAccess';
import ContactPopup from './contact-popup.vue';
import FilterSearch from '../modules/filters/components/filter-search.vue';
import { useDummy } from '../composables/useDummy';
import getNamespacedState
  from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';

const baseNamespace = 'contacts';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

const {
  namespace,

  dataList,
  isLoading,
  headers,
  isNext,
  error,

  loadData,
  deleteData,
  sort,
} = useTableStore(baseNamespace);

const {
  hasObacCreateAccess,
  hasObacEditAccess,
  hasObacDeleteAccess,
} = useAccess();

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const { filtersNamespace } = useTableFilters(namespace);

const isContactPopup = ref(false);
const editedContactId = ref(null);

const path = computed(() => [
  { name: t('crm') },
  { name: t('contacts.contact', 2), route: '/' },
]);

// we need to check if there's any filters which actually filter data before showing "no data" dummy
// const showDummy = computed(() => {
//   if (dataList.value.length) return false;
//   const filters = store.getters[`${namespace}/GET_FILTERS`];
//   const defaultFilters = ['page', 'size', 'sort', 'fields'];
//   const dynamicFilters = Object.keys(filters).reduce((dynamic, filter) => {
//     if (defaultFilters.includes(filter)) return dynamic;
//     return {
//       ...dynamic,
//       [filter]: filters[filter],
//     };
//   }, {});
//   return isEmpty(dynamicFilters);
// });

const page = computed(() => getNamespacedState(store.state, namespace).filters.page.value);

function setFilter(payload) {
  return store.dispatch(`${namespace}/filters/SET_FILTER`, payload);
}

function setPage(value) {
  return setFilter({ value, filter: 'page' });
}

const { dummy } = useDummy({
  namespace,
  page: page.value,
  setPage,
});

const deletableSelectedItems = computed(() => (
  dataList.value.filter((item) => item._isSelected && item.access.delete)
));

function create() {
  isContactPopup.value = true;
}

function edit({ id }) {
  editedContactId.value = id;
  isContactPopup.value = true;
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
</script>

<style lang="scss" scoped>
.username-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  .wt-avatar {
    flex: 0 0 var(--avatar-size--size-sm);
  }
}

.contacts-labels-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2xs);
}
</style>
