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
            {{ t('lookups.serviceCatalogs.serviceCatalogs') }}
          </h3>
          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!selected.length"
            @click:add="addNewCatalog"
            @click:refresh="refresh"
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

        <div
          class="table-section__table-wrapper"
        >
          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :text="textEmpty"
            :primary-action-text="primaryActionText"
            @click:primary="addNewCatalog"
          />

          <wt-loader v-show="isLoading" />

          <div v-if="dataList.length && !isLoading">
            <wt-tree-table
              :headers="headers"
              :data="dataList"
              :selected="selected"
              children-prop="service"
              selectable
              sortable
              @sort="sort"
              @update:selected="setSelected"
            >
              <template #name="{ item }">
                <wt-item-link
                  v-if="isRootElement(item)"
                  :link="{ name: `${CrmSections.SERVICE_CATALOGS}-card`, params: { id: item.id } }"
                >
                  {{ item.name }}
                </wt-item-link>
                <template v-else>
                  {{ item.name }}
                </template>
              </template>
              <template #sla="{ item }">
                {{ item.sla?.name }}
              </template>
              <template #close_reason="{ item }">
                {{ item.close_reason?.name }}
              </template>

              <template #state="{ item }">
                <wt-switcher
                  :value="item.state"
                  @change="changeState(item)"
                />
              </template>
              <template #teams="{ item }">
                <template v-if="!isRootElement(item)">
                  -
                </template>
                <template v-else>
                  {{ getFirstItemName(item.teams) }}
                  <wt-chip v-if="displayCountChipItems(item.teams)">
                    {{ displayCountChipItems(item.teams) }}
                  </wt-chip>
                </template>
              </template>
              <template #skills="{ item }">
                <template v-if="!isRootElement(item)">
                  -
                </template>
                <template v-else>
                  {{ getFirstItemName(item.skills) }}
                  <wt-chip v-if="displayCountChipItems(item.skills)">
                    {{ displayCountChipItems(item.skills) }}
                  </wt-chip>
                </template>
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
            </wt-tree-table>
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
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import { computed, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useRouter } from 'vue-router';

import filters from '../../slas/modules/filters/store/filters.js';

const baseNamespace = 'configuration/lookups/catalogs';

const { t } = useI18n();
const router = useRouter();

const path = computed(() => [
  { name: t('crm') },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.serviceCatalogs.serviceCatalogs', 2), route: '/lookups/service-catalogs' },
]);

const { close } = useClose('configuration');

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
  resetState,
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
  resetState();
});

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  primaryActionText,
} = useTableEmpty({ dataList, filters, error, isLoading });

const addNewCatalog = () => {
  router.push({ name: `${CrmSections.SERVICE_CATALOGS}-card`, params: { id: 'new' }})
}

const edit = (item) => {
  return router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-card`,
    params: { id: item.id },
  });
}

const refresh = () => {
  resetState();
  loadData();
};

const isRootElement = (item) => !item.root_id;

const getFirstItemName = (items) => {
  if(!items?.length) return '';

  return items[0]?.name
};
const displayCountChipItems = (items) => {
  if(!items?.length) return 0;

  switch (items.length) {
    case 1:
      return 0;
    case 2:
      return 1;
    default:
      return '+1';
  }
}
const changeState = (item) => {
  console.log('item')
}
const chipElements = (items) => {
  if(!items?.length) return [];

  return items.slice(1);
}

watch(() => filtersValue.value, () => {
  resetState();
});
</script>
