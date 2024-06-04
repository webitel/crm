<template>
  <wt-page-wrapper
    :actions-panel="false"
    class="contacts"
  >
    <template #header>
      <contact-popup
        :id="editedContactId"
        :namespace="baseNamespace"
        :shown="isContactPopup"
        @close="closeContactPopup"
        @saved="saved"
      />

      <wt-page-header
        :primary-action="create"
        :primary-disabled="!hasObacCreateAccess"
        :secondary-action="deleteSelectedItems"
        :secondary-disabled="!hasObacDeleteAccess || !deletableSelectedItems.length"
        :secondary-text="$t('reusable.delete')"
      >
        <wt-headline-nav :path="path" />
        <template #actions>
          <filter-search
            :namespace="filtersNamespace"
            :search-mode-opts="searchModeOpts"
            multisearch
          />
        </template>
      </wt-page-header>
    </template>
    <template #main>
      <wt-loader v-show="isLoading" />

      <wt-dummy
        v-if="!isLoading && !dataList.length"
        :dark-mode="darkMode"
        :src="dummy.src"
        :text="dummy.text"
      />

      <delete-confirmation-popup
        :shown="isDeleteConfirmationPopup"
        :callback="deleteCallback"
        :delete-count="deleteCount"
        @close="closeDelete"
      />

      <div
        v-show="!isLoading && dataList.length"
        class="table-wrapper"
      >
        <wt-table
          :data="dataList"
          :headers="headers"
          :selected="selected"
          sortable
          @sort="sort"
          @update:selected="setSelected"
        >
          <template #name="{ item }">
            <div class="username-wrapper">
              <wt-avatar
                :username="item.name.commonName"
                size="sm"
              />
              <wt-item-link
                :link="{ name: `${CrmSections.CONTACTS}-card`, params: { id: item.id } }"
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
          :is-next="isNext"
          :namespace="filtersNamespace"
        />
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import variableSearchValidator from '@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator';
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import dummyDark from '../../../app/assets/dummy-dark.svg';
import dummyLight from '../../../app/assets/dummy-light.svg';
import { useAccess } from '../../../app/composables/useAccess';
import SearchMode from '../modules/filters/enums/SearchMode.enum.js';
import ContactPopup from './contact-popup.vue';

const baseNamespace = 'contacts';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

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

const {
  namespace,

  dataList,
  selected,
  isLoading,
  headers,
  isNext,
  error,

  loadData,
  deleteData,
  sort,
  setSelected,
  onFilterEvent,
} = useTableStore(baseNamespace);

const {
  namespace: filtersNamespace,
  restoreFilters,

  subscribe,
  flushSubscribers,
} = useTableFilters(namespace);

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
});


const isContactPopup = ref(false);
const editedContactId = ref(null);

const path = computed(() => [
  { name: t('crm') },
  { name: t('contacts.contact', 2), route: '/' },
]);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const dummyPic = computed(() => (darkMode.value ? dummyDark : dummyLight));

const searchModeOpts = computed(() => [
  {
    value: SearchMode.NAME,
    text: t('reusable.name'),
  },
  {
    value: SearchMode.LABELS,
    text: t('vocabulary.labels', 1),
  },
  {
    value: SearchMode.ABOUT,
    text: t('vocabulary.description'),
  },
  {
    value: SearchMode.VARIABLES,
    text: t('contacts.attributes', 1),
    hint: t('webitelUI.searchBar.variableSearchHint'),
    v: { variableSearchValidator },
  },
  {
    value: SearchMode.DESTINATION,
    text: t('contacts.destination'),
  },
]);

// we need to check if there's any filters which actually filter data before showing "no data" dummy

// [WTEL-3776]
// display different images when no contacts have been created yet (default img)
// and when the filter didn't produce results
const dummy = computed(() => {
  if (dataList.value.length) return false;
  const filters = store.getters[`${filtersNamespace}/_STATE_FILTER_NAMES`];
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
  selected.value.filter((item) => item.access.delete)
));

function create() {
  isContactPopup.value = true;
}

function edit({ id }) {
  editedContactId.value = id;
  isContactPopup.value = true;
}

function saved(id) {
  router.push({
    name: CrmSections.CONTACTS,
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
