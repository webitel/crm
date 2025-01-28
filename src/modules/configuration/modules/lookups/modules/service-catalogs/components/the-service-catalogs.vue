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
            @click:delete="
              askDeleteConfirmation({
                deleted: selected,
                callback: () => deleteData(selected),
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
                  class="the-service-catalogs__service-name"
                  :link="{
                    name: `${CrmSections.SERVICE_CATALOGS}-services`,
                    params: {
                      catalogId: item.catalogId ? item.catalogId : item.id,
                      rootId: item.id,
                    },
                  }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>
              <template #description="{ item }">
                <p class="the-service-catalogs__service-description">
                  {{ item.description }}
                </p>
              </template>
              <template #sla="{ item }">
                {{ displayText(item.sla?.name) }}
              </template>
              <template #statuses="{ item }">
                <template v-if="isRootElement(item)">
                  {{ displayText(item.status?.name) }}
                </template>
                <template v-else>
                  <wt-item-link
                    v-if="item.assignee?.id"
                    class="the-service-catalogs__service-assignee"
                    target="_blank"
                    :link="{
                      name: `${CrmSections.CONTACTS}-card`,
                      params: { id: item.assignee.id },
                    }"
                  >
                    {{ item.assignee.name }}
                  </wt-item-link>
                  <template v-else>
                    {{ displayText(item.assignee?.name) }}
                  </template>
                </template>
              </template>
              <template #closeReasonGroup="{ item }">
                {{
                  isRootElement(item)
                    ? displayText(item.closeReasonGroup?.name)
                    : displayText(item.group?.name)
                }}
              </template>

              <template #prefix="{ item }">
                {{ displayText(item.prefix) }}
              </template>
              <template #state="{ item, index }">
                <wt-switcher
                  :value="item.state"
                  @change="changeState(item, index)"
                />
              </template>
              <template #code="{ item }">
                {{ displayText(item.code) }}
              </template>
              <template #description="{ item }">
                {{ displayText(item.description) }}
              </template>
              <template #teams="{ item }">
                <template v-if="!isRootElement(item)"> - </template>
                <template v-else>
                  <display-chip-items :items="item.teams" />
                </template>
              </template>
              <template #skills="{ item }">
                <template v-if="!isRootElement(item)"> - </template>
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
                  @click="
                    askDeleteConfirmation({
                      deleted: [item],
                      callback: () => deleteData(item),
                    })
                  "
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
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { computed, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { displayText } from '../../../../../../../app/utils/displayText.js';
import filters from '../../slas/modules/filters/store/filters.js';
import CatalogsAPI from '../api/service-catalogs.js';
import ServicesAPI from '../modules/services/api/services.js';
import DisplayChipItems from './display-chip-items.vue';

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
  router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-card`,
    params: { id: 'new' },
  });
};

const edit = (item) => {
  if (isRootElement(item)) {
    return router.push({
      name: `${CrmSections.SERVICE_CATALOGS}-card`,
      params: { id: item.id },
    });
  } else {
    return router.push({
      name: `${CrmSections.SERVICE_CATALOGS}-services-card`,
      params: {
        catalogId: item.catalogId,
        rootId: item.rootId,
        id: item.id,
      },
    });
  }
};

const isRootElement = (item) => !item.rootId;

const changeState = async (item) => {
  if (isRootElement(item)) {
    await CatalogsAPI.update({
      itemInstance: {
        ...item,
        state: !item.state,
      },
      itemId: item.id,
    });

    item.state = !item.state;
  } else {
    await ServicesAPI.patch({
      changes: {
        state: !item.state,
      },
      id: item.id,
    });

    item.state = !item.state;
  }
};
</script>

<style scoped lang="scss">
.the-service-catalogs {
  &__service-assignee {
    color: var(--text-link-color) !important;
  }

  &__service-name,
  &__service-description {
    max-width: 300px;
    text-wrap: wrap;
  }
}
</style>
