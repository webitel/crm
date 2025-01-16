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
            {{ t('lookups.service.service') }}
          </h3>
          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!selected.length"
            @click:add="addNewService"
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
            :primary-action-text="primaryActionText"
            @click:primary="addNewService"
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
                {{ item.name }}
              </template>
              <template #description="{ item }">
                {{ item.description }}
              </template>
              <template #state="{ item, index }">
                <wt-switcher
                  :value="item.state"
                  @change="patchProperty({index, prop: 'state', value: $event})"
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
import { computed, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import filters from '../modules/filters/store/filters.js';

import { onMounted } from 'vue';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useRoute } from 'vue-router';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';

const route = useRoute();
const store = useStore()

const baseNamespace = 'configuration/lookups/services';
const catalogNamespace = 'configuration/lookups/catalogs';

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
  id,
  itemInstance,
  ...restStore
} = useCardStore(catalogNamespace);

const { isNew, pathName, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});

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
  patchProperty
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

const path = computed(() => {
  return [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.serviceCatalogs.serviceCatalogs', 2), route: '/lookups/service-catalogs' },
    {
      name: pathName.value,
    },
  ];
});
const { close } = useClose('configuration');

function edit(item) {
  return router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-services-card`,
    params: { id:route.params?.id, serviceId: item.id },
  });
}

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  primaryActionText,
} = useTableEmpty({ dataList, filters, error, isLoading });

const addNewService = () => {
  router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-services-card`,
    params: { id:route.params?.id, serviceId: 'new' },
  })
}

const refresh = () => {
  resetState();
  loadData();
};

watch(() => filtersValue.value, () => {
  resetState();
});

onUnmounted(() => {
  flushSubscribers();
  resetState();
});

onMounted(async () => {
  if(isNew.value)  {
    router.push({ name: CrmSections.SERVICE_CATALOGS})
  }

  store.dispatch(`${baseNamespace}/table/SELECT_ROOT`, {
    rootId: route.params?.id,
  })

  await loadData();
});

initialize();
</script>
