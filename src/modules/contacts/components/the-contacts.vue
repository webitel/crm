<template>
  <wt-page-wrapper
    class="contacts"
    :actions-panel="false"
  >
    <template #header>
      <contact-popup
        :shown="isContactPopup"
        :id="editedContactId"
        :namespace="baseNamespace"
        @saved="saved"
        @close="closeContactPopup"
      />

      <wt-page-header
        :primary-action="create"
        :secondary-text="$t('reusable.delete')"
        :secondary-action="deleteSelectedItems"
        :secondary-disabled="!hasObacDeleteAccess || !deletableSelectedItems.length"
        :primary-disabled="!hasObacCreateAccess"
      >
        <wt-headline-nav :path="path" />
        <template #actions>
          <filter-search
            :namespace="filtersNamespace"
          />
        </template>
      </wt-page-header>
    </template>
    <template #main>
      <wt-loader v-show="isLoading" />

      <wt-dummy
        v-if="!isLoading && !dataList.length"
        :src="dummy.src"
        :text="dummy.text"
        :dark-mode="darkMode"
      />

      <delete-confirmation-popup
        v-show="isDeleteConfirmationPopup"
        :delete-count="deleteCount"
        :callback="deleteCallback"
        @close="closeDelete"
      />

      <div
        v-show="!isLoading && dataList.length"
        class="table-wrapper"
      >
        <wt-table
          :headers="headers"
          :data="dataList"
          sortable
          @sort="sort"
        >
          <template #name="{ item }">
            <div class="username-wrapper">
              <wt-avatar
                size="sm"
                :username="item.name.commonName"
              />
              <wt-item-link
                  :link="communicationsLink(item)"
              >
                {{ item.name.commonName }}
              </wt-item-link>
            </div>
          </template>
          <template #managers="{ item }">
            {{ item.managers?.data[0].user.name }}
          </template>
          <template #labels="{ item }">
            <div
              v-if="item.labels"
              class="contacts-labels-wrapper"
            >
              <wt-chip
                v-for="({ label, id }) of item.labels.data"
                :key="id"
              >
                {{ label }}
              </wt-chip>
            </div>
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
              @click="askDeleteConfirmation({
                deleted: [item],
                callback: () => deleteData(item),
              })"
            />
          </template>
        </wt-table>
        <filter-pagination
          :namespace="filtersNamespace"
          :is-next="isNext"
        />
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
import dummyLight from '../../../app/assets/dummy-light.svg';
import dummyDark from '../../../app/assets/dummy-dark.svg';

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
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const dummyPic = computed(() => (darkMode.value ? dummyDark : dummyLight));

// we need to check if there's any filters which actually filter data before showing "no data" dummy

// [WTEL-3776]
// display different images when no contacts have been created yet (default img)
// and when the filter didn't produce results
const dummy = computed(() => {
  if (dataList.value.length) return false;
  const filters = store.getters[`${namespace}/GET_FILTERS`];
  const defaultFilters = ['page', 'size', 'sort', 'fields'];
  const dynamicFilters = Object.keys(filters).reduce((dynamic, filter) => {
    if (defaultFilters.includes(filter)) return dynamic;
    return {
      ...dynamic,
      [filter]: filters[filter],
    };
  }, {});
  const isEmptyFilters = isEmpty(dynamicFilters);

  return {
    src: isEmptyFilters ? '' : dummyPic.value,
    text: isEmptyFilters ? '' : t('vocabulary.emptyResultSearch'),
  };
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

function communicationsLink({ id }) {
  const routeName = CrmSections.CONTACTS;
  return { name: `${routeName}-timeline`, params: { id } };
}

function saved(id) {
  router.push(`/${CrmSections.CONTACTS}/${id}/timeline`);
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
    flex: 0 0 var(--wt-avatar-size--size-sm);
  }
}

.contacts-labels-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2xs);
}
</style>
