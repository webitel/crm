<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('customization.customLookups.customLookups') }}
          </h3>
          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!selected.length"
            @click:refresh="loadData"
            @click:add="
              router.push({
                name: `${CrmSections.CUSTOM_LOOKUPS}-card`,
                params: { id: 'new' },
              })
            "
            @click:delete="
              askDeleteConfirmation({
                deleted: selected,
                callback: () => deleteMany(selected),
              })
            "
          >
            <template #search-bar>
              <filter-search
                :namespace="filtersNamespace"
                name="search"
              />
            </template>
          </wt-action-bar>
        </header>

        <delete-confirmation-popup
          :shown="isDeleteConfirmationPopup"
          :callback="deleteCallback"
          :delete-count="deleteCount"
          @close="closeDelete"
        />

        <div class="table-section__table-wrapper">
          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :headline="emptyHeadline"
            :title="emptyTitle"
            :text="textEmpty"
            :primary-action-text="emptyPrimaryActionText"
            @click:primary="router.push({
              name: `${CrmSections.CUSTOM_LOOKUPS}-card`,
              params: { id: 'new' },
            })"
          />

          <wt-loader v-show="isLoading" />

          <div v-if="dataList.length && !isLoading">
            <wt-table
              :data="dataList"
              :headers="headers"
              :selected="selected"
              sortable
              @sort="sort"
              @update:selected="setSelected"
            >
              <template #name="{ item }">
                <wt-item-link
                  :link="{
                    name: `${CrmSections.CUSTOM_LOOKUPS}-card`,
                    params: { id: item.repo },
                  }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>
              <template #about="{ item }">
                {{ item.about }}
              </template>
              <template #createdAt="{ item }">
                {{ prettifyDate(item.createdAt) }}
              </template>
              <template #createdBy="{ item }">
                {{ item.createdBy?.name }}
              </template>
              <template #actions="{ item }">
                <wt-icon-action
                  v-if="hasEditAccess"
                  action="edit"
                  @click="edit(item)"
                />
                <wt-icon-action
                  v-if="hasDeleteAccess"
                  action="delete"
                  @click="
                    askDeleteConfirmation({
                      deleted: [item],
                      callback: () => deleteData(item),
                    })
                  "
                />
              </template>
            </wt-table>
          </div>
          <filter-pagination
            :namespace="filtersNamespace"
            :is-next="isNext"
          />
        </div>
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { WtEmpty } from '@webitel/ui-sdk/components';
import {
  useAccessControl,
} from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import {
  useTableFilters,
} from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import {
  useTableEmpty,
} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import {
  useTableStore,
} from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import prettifyDate from '../../../../cases/utils/prettifyDate.js';

const baseNamespace = 'customization/customLookups';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasEditAccess, hasDeleteAccess } = useAccessControl();

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
  filtersValue,
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

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('customization.customization'), route: '/customization' },
  { name: t('customization.customLookups.customLookups') },
]);

const { close } = useClose('configuration');

function edit(item) {
  router.push({
    name: `${CrmSections.CUSTOM_LOOKUPS}-card`,
    params: { id: item.repo },
  });
}

// This method for delete many lookups, one by one, because if we send many delete lookups requests at once, backend will return error
const deleteMany = async (items) => {
  for (const item of items) {
    await deleteData(item);
  }
};

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  headline: emptyHeadline,
  title: emptyTitle,
  primaryActionText: emptyPrimaryActionText,
} = useTableEmpty({
  dataList,
  error,
  filters: filtersValue,
  isLoading,
});
</script>

<style lang="scss" scoped></style>
