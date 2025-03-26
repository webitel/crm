<template>
  <wt-page-wrapper
    :actions-panel="false"
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
          <dynamic-filter-search
            :model-value="searchValue"
            :search-mode="searchMode"
            :search-mode-options="searchModeOpts"
            @handle-search="handleSearch"
            @update:search-mode="searchMode = $event"
          />
        </template>
      </wt-page-header>
    </template>

    <template #main>
      <wt-loader v-show="isLoading" />

      <wt-empty
        v-if="showEmpty"
        :image="emptyImage"
        :headline="emptyHeadline"
        :title="emptyTitle"
        :text="emptyText"
        :primary-action-text="emptyPrimaryActionText"
        :disabled-primary-action="!hasCreateAccess"
        @click:primary="add"
      />

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
          @sort="updateSort"
          @update:selected="updateSelected"
        >
          <template #name="{ item }">
            <div class="username-wrapper">
              <wt-avatar
                size="xs"
                :username="item.name"
              />

              <wt-item-link
                :link="{
                  name: `${CrmSections.CONTACTS}-card`,
                  params: { id: item.id },
                }"
              >
                {{ item.name }}
              </wt-item-link>
            </div>
          </template>

          <template #user="{ item }">
            <wt-icon
              v-if="item.user"
              icon="webitel-logo"
            />
          </template>

          <template #groups="{ item }">
            <div
              v-if="item.groups"
              class="contacts-groups"
            >
              <p>
                {{ item.groups[0]?.name }}
              </p>

              <wt-tooltip
                v-if="item.groups.length > 1"
                :triggers="['click']"
              >
                <template #activator>
                  <wt-chip> +{{ item.groups.length - 1 }} </wt-chip>
                </template>

                <div class="contacts-groups__wrapper">
                  <p
                    v-for="(group, idx) of item.groups.slice(1)"
                    :key="idx"
                  >
                    {{ group.name }}
                  </p>
                </div>
              </wt-tooltip>
            </div>
          </template>

          <template #about="{ item }">
            {{ item.about }}
          </template>

          <template #managers="{ item }">
            {{ item.managers[0]?.user.name }}
          </template>

          <template #labels="{ item }">
            <div
              v-if="item.labels"
              class="contacts-labels-wrapper"
            >
              <wt-chip
                v-for="{ label, id } of item.labels"
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
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteEls(item),
                })
              "
            />
          </template>
        </wt-table>

        <wt-pagination
          :next="next"
          :prev="page > 1"
          :size="size"
          debounce
          @change="updateSize"
          @next="updatePage(page + 1)"
          @prev="updatePage(page - 1)"
        />
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup lang="ts">
import ContactsSearchMode from '@webitel/ui-sdk/src/api/clients/сontacts/enums/ContactsSearchMode.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import variableSearchValidator from '@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator';
import { storeToRefs } from 'pinia';
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import DynamicFilterSearch from '../../../../../../sdk/webitel-ui-sdk/src/modules/Filters/v2/filters/components/dynamic-filter-search.vue';
import dummyDark from '../../../app/assets/dummy-dark.svg';
import dummyLight from '../../../app/assets/dummy-light.svg';
import { SearchMode, SearchModeType } from '../../cases/filters/SearchMode.js';
import { ContactsNamespace } from '../namespace';
import { useContactsStore } from '../stores/contacts';
import ContactPopup from './contact-popup.vue';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

const { hasCreateAccess, hasDeleteAccess } = useAccessControl('contacts');

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const searchMode = ref<SearchModeType>(SearchMode.Search);
const searchValue = ref('');

const tableStore = useContactsStore();

const {
  dataList,
  selected,
  error,
  isLoading,
  page,
  size,
  next,
  headers,
  shownHeaders,
  filtersManager,
} = storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
  deleteEls,
} = tableStore;

// const {
//   namespace,
//
//   dataList,
//   selected,
//   isLoading,
//   headers,
//   isNext,
//   error,
//
//   loadData,
//   deleteData,
//   sort,
//   setSelected,
//   onFilterEvent,
// } = useTableStore(baseNamespace);

// const {
//   namespace: filtersNamespace,
//   restoreFilters,
//
//   subscribe,
//   flushSubscribers,
// } = useTableFilters(namespace);
//
// subscribe({
//   event: '*',
//   callback: onFilterEvent,
// });
//
// restoreFilters();
//
// onUnmounted(() => {
//   flushSubscribers();
// });

const isContactPopup = ref(false);
const editedContactId = ref(null);

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('contacts.contact', 2) },
]);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const dummyPic = computed(() => (darkMode.value ? dummyDark : dummyLight));

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
    callback: () => deleteEls([...deletableSelectedItems.value]),
  });
}
</script>

<style lang="scss" scoped>
.contacts {
  &-groups {
    display: flex;
    gap: var(--spacing-xs);
  }

  &-labels-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2xs);
  }
}

.username-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);

  .wt-avatar {
    flex: 0 0 var(--wt-avatar-size--size-xs);
  }
}
</style>
