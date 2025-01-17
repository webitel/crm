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
            {{ t('vocabulary.priority') }}
          </h3>

          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:delete="!selected.length"
            @click:add="router.push({ name: `${CrmSections.PRIORITIES}-card`, params: { id: 'new' }})"
            @click:refresh="loadData"
            @click:delete="askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteData(selected),
            })"
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

        <div
          class="table-section__table-wrapper"
        >
          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :text="textEmpty"
          />

          <wt-loader v-show="isLoading" />

          <div v-if="dataList.length && !isLoading">
            <wt-table
              :data="dataList"
              :headers="headers"
              :selected="selected"
              :selectable="true"
              sortable
              @sort="sort"
              @update:selected="setSelected"
            >
              <template #name="{ item }">
                <wt-item-link
                  :link="{ name: `${CrmSections.PRIORITIES}-card`, params: { id: item.id } }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>

              <template #color="{ item }">
                <color-component-wrapper
                  :color="item.color"
                  component-type="wt-indicator"
                />
              </template>

              <template #actions="{ item }">
                <wt-icon-action
                  action="edit"
                  @click="edit(item)"
                />

                <wt-icon-action
                  action="delete"
                  @click="askDeleteConfirmationWrapper(item)"
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
import {computed, onUnmounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import {
  useDeleteConfirmationPopup
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import {
  useTableEmpty
} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';

const baseNamespace = 'configuration/lookups/priorities';

const { t } = useI18n();
const router = useRouter();

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
  { name: t('crm') },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('vocabulary.priority', 2) },
]);

const { close } = useClose('configuration');

function askDeleteConfirmationWrapper(item) {
  askDeleteConfirmation({
    deleted: [item],
    callback: () => deleteData(item),
  })
}

function edit(item) {
  return router.push({
    name: `${CrmSections.PRIORITIES}-card`,
    params: { id: item.id },
  });
}

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
} = useTableEmpty({ dataList, error, isLoading });
</script>

<style lang="scss" scoped>
</style>
