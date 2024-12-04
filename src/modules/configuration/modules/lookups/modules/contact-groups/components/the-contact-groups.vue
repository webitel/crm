<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        hide-primary
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('lookups.contactGroups.contactGroups', 2) }}
          </h3>
          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!hasDeleteAccess"
            @click:add="router.push({ name: `${CrmSections.CONTACT_GROUPS}-card`, params: { id: 'new' }})"
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

        <wt-loader v-show="isLoading" />

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

          <wt-table-transition v-if="dataList.length && !isLoading">
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
                  :link="{ name: `${CrmSections.CONTACT_GROUPS}-card`, params: { id: item.id } }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>

              <template #description="{ item }">
                {{ item.description }}

              </template>

              <template #type="{ item }">
                {{ item.type }}
              </template>

              <template #state="{ item, index }">
                <wt-switcher
                  :disabled="!hasEditAccess"
                  :value="item.enabled"
                  @change="patchProperty({ item, index, prop: 'enabled', value: $event})"
                />
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
                  @click="askDeleteConfirmation({
                deleted: [item],
                callback: () => deleteData(item),
              })"
                />
              </template>
            </wt-table>
          </wt-table-transition>
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
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import WtTableTransition from '@webitel/ui-sdk/src/components/on-demand/wt-table-transition/wt-table-transition.vue';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore.js';
import { computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import filters from '../modules/filters/store/filters.js';

const baseNamespace = 'configuration/lookups/contactGroups';

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
  patchProperty,
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

const path = computed(() => [
  { name: t('crm') },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.sources.sources', 2), route: '/contact-groups' },
]);

const { close } = useClose('configuration');

function edit(item) {
  return router.push({
    name: `${CrmSections.CONTACT_GROUPS}-card`,
    params: { id: item.id },
  });
}

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
} = useTableEmpty({ dataList, filters, error, isLoading });
</script>

<style lang="scss" scoped>
</style>
