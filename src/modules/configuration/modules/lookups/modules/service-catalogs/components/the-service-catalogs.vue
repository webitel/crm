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
                  :link="{ name: `${CrmSections.SERVICE_CATALOGS}-services`, params: { id: item.id } }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>
              <template #sla="{ item }">
                {{ displayText(item.sla?.name) }}
              </template>
              <template #statuses="{ item }">
                {{ displayText(item.status?.name) }}
              </template>
              <template #close_reason="{ item }">
                {{ displayText(item.close_reason?.name) }}
              </template>

              <template
                #prefix="{ item }"
              >
                {{ displayText(item.prefix) }}
              </template>

              <template #state="{ item, index }">
                <wt-switcher
                  :value="item.state"
                  @change="changeState(item, index)"
                />
              </template>
              <template #teams="{ item }">
                <template v-if="!isRootElement(item)">
                  -
                </template>
                <template v-else>
                  <display-chip-items :items="item.teams" />
                </template>
              </template>
              <template #skills="{ item }">
                <template v-if="!isRootElement(item)">
                  -
                </template>
                <template v-else>
                  <display-chip-items :items="item.skills" />
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
import CatalogsAPI from '../api/service-catalogs.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import DisplayChipItems from './display-chip-items.vue';
import ServicesAPI from '../modules/services/api/services.js';
import { displayText } from '../../../../../../../app/utils/displayText.js';

const baseNamespace = 'configuration/lookups/catalogs';


const { t } = useI18n();
const router = useRouter();

const path = computed(() => [
  { name: t('crm') },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.serviceCatalogs.serviceCatalogs', 2) },
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

const isRootElement = (item) => !item.root_id;

const changeState = async (item) => {
  if(isRootElement(item)) {
    await CatalogsAPI.update({
      itemInstance: {
        ...item,
        state: !item.state,
      },
      itemId: item.id,
    })

    item.state = !item.state;
  } else {

    ServicesAPI.patch({
      changes: {
        state: !item.state,
      },
      id: item.id,
    })
  }
}
</script>
