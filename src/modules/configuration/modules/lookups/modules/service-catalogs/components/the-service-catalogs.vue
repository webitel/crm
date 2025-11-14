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
        <wt-breadcrumb :path="path" />
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
            :disabled:delete="!hasDeleteAccess || !selected.length"
            :disabled:add="!hasCreateAccess"
            @click:add="addNewCatalog"
            @click:refresh="loadDataList"
            @click:delete="
              askDeleteConfirmation({
                deleted: selected,
                callback: () => deleteEls(selected),
              })
            "
          >
            <template #search-bar>
              <dynamic-filter-search
                :filters-manager="filtersManager"
                :is-filters-restoring="isFiltersRestoring"
                @filter:add="addFilter"
                @filter:update="updateFilter"
                @filter:delete="deleteFilter"
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

        <div class="table-section__table-wrapper the-service-catalogs__table-wrapper">
          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :text="textEmpty"
            :primary-action-text="primaryActionTextEmpty"
            :disabled-primary-action="!hasCreateAccess"
            @click:primary="addNewCatalog"
          />

          <wt-loader v-show="isLoading" />

          <div v-show="dataList.length && !isLoading" class="the-service-catalogs__table">
            <wt-tree-table
              :headers="shownHeaders"
              :data="dataList"
              :selected="selected"
              children-prop="service"
              selectable
              sortable
              @sort="updateSort"
              @update:selected="updateSelected"
            >
              <template #name="{ item }">
                <wt-item-link
                  class="the-service-catalogs__service-name"
                  :link="{
                    name: `${CrmSections.ServiceCatalogs}-services`,
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
                      name: `${CrmSections.Contacts}-card`,
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
                  :model-value="item.state"
                  :disabled="
                    !hasUpdateAccess ||
                    checkParentState({
                      catalog: getCatalog(item),
                      item,
                    })
                  "
                  @update:model-value="changeState(item, index)"
                />
              </template>
              <template #code="{ item }">
                {{ displayText(item.code) }}
              </template>
              <template #teams="{ item }">
                <template v-if="!isRootElement(item)"> -</template>
                <template v-else>
                  <wt-display-chip-items :items="item.teams" />
                </template>
              </template>
              <template #skills="{ item }">
                <template v-if="!isRootElement(item)"> -</template>
                <template v-else>
                  <wt-display-chip-items :items="item.skills" />
                </template>
              </template>
              <template #actions="{ item }">
                <wt-icon-action
                  :disabled="!hasUpdateAccess"
                  action="edit"
                  @click="edit(item)"
                />
                <wt-icon-action
                  :disabled="!hasDeleteAccess"
                  action="delete"
                  @click="
                    askDeleteConfirmation({
                      deleted: [item],
                      callback: () => deleteEls(item),
                    })
                  "
                />
              </template>
            </wt-tree-table>
          </div>

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
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { WtDisplayChipItems,WtEmpty, WtTreeTable } from '@webitel/ui-sdk/components';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections, IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { displayText } from '@webitel/ui-sdk/utils';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import ServicesAPI from '../modules/services/api/services';
import { useServiceCatalogsStore } from '../stores/service-catalogs';
import { checkDisableState } from '../utils/checkDisableState';

const { t } = useI18n();
const router = useRouter();

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.serviceCatalogs.serviceCatalogs', 2) },
]);

const { close } = useClose('configuration');

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl();

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useServiceCatalogsStore();

const {
  dataList,
  selected,
  isLoading,
  shownHeaders,
  page,
  size,
  next,
  error,
  filtersManager,
  isFiltersRestoring,
} = storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
  deleteEls,
  addFilter,
  updateFilter,
  deleteFilter,
  updatePage,
  updateSize,
  updateSort,
  updateSelected,
} = tableStore;

initialize();

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({
  dataList,
  filters: computed(() => filtersManager.value.getAllValues()),
  error,
  isLoading,
});

const addNewCatalog = () => {
  router.push({
    name: `${CrmSections.ServiceCatalogs}-card`,
    params: { id: 'new' },
  });
};

const edit = (item) => {
  if (isRootElement(item)) {
    return router.push({
      name: `${CrmSections.ServiceCatalogs}-card`,
      params: { id: item.id },
    });
  } else {
    return router.push({
      name: `${CrmSections.ServiceCatalogs}-services-card`,
      params: {
        catalogId: item.catalogId,
        rootId: item.rootId,
        id: item.id,
      },
    });
  }
};

const isRootElement = (item) => !item.rootId;

const getCatalog = (item) => {
  return dataList.value.find((catalog) => catalog.id === item.catalogId);
};

// That computed property is used in the template with dynamic pass params, we can't get catalog inside because reactivity doesn't work correctly. For resolve issue with reactivity we need pass catalog py params
const checkParentState = computed(() => ({ catalog, item }) => {
  if (!catalog) {
    return false;
  }

  return checkDisableState(catalog, item);
});

const changeState = async (item) => {
  if (isRootElement(item)) {
    await ServiceCatalogsAPI.update({
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

  &__table-wrapper {
    max-height: 100%;
  }

  &__table {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
