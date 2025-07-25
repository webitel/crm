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
            :disabled:delete="!hasDeleteAccess || !selected.length"
            :disabled:add="!hasCreateAccess"
            @click:add="addNewService"
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
            :primary-action-text="primaryActionTextEmpty"
            :disabled-primary-action="!hasCreateAccess"
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
                <wt-item-link
                  class="the-catalog-service__service-name"
                  :link="{
                    name: `${CrmSections.SERVICE_CATALOGS}-services`,
                    params: {
                      catalogId: route.params?.id,
                      rootId: item.id,
                    },
                  }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>
              <template #description="{ item }">
                <p class="the-catalog-service__service-description">
                  {{ item.description }}
                </p>
              </template>
              <template #group="{ item }">
                {{ displayText(item.group?.name) }}
              </template>
              <template #assignee="{ item }">
                <wt-item-link
                  v-if="item.assignee?.id"
                  class="the-catalog-service__service-assignee"
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
              <template #state="{ item, index }">
                <wt-switcher
                  :value="item.state"
                  :disabled="!hasUpdateAccess || disableStateSwitcher(item)"
                  @change="
                    patchProperty({ index, prop: 'state', value: $event })
                  "
                />
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
import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { useClose } from '@webitel/ui-sdk/composables';
import { IconAction } from '@webitel/ui-sdk/enums';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { displayText } from '@webitel/ui-sdk/utils';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { checkDisableState } from '../../../utils/checkDisableState.js';
import prettifyBreadcrumbName from '../../../utils/prettifyBreadcrumbName.js';
import ServicesAPI from '../api/services.js';

const route = useRoute();
const store = useStore();

const baseNamespace = 'configuration/lookups/services';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const rootService = ref(null);
const catalog = ref(null);

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
  filtersValue,

  subscribe,
  flushSubscribers,
} = useTableFilters(namespace);

subscribe({
  event: '*',
  callback: onFilterEvent,
});

const path = computed(() => {
  const routes = [
    { name: t('crm'), route: '/start-page' },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    {
      name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
      route: '/lookups/service-catalogs',
    },
  ];

  if (route.params.rootId === route.params.catalogId) {
    routes.push({
      name: prettifyBreadcrumbName(catalog.value?.name),
    });

    return routes;
  } else {
    routes.push({
      name: prettifyBreadcrumbName(catalog.value?.name),
      route: {
        name: `${CrmSections.SERVICE_CATALOGS}-services`,
        params: {
          catalogId: catalog.value?.id,
          rootId: catalog.value?.id,
        },
      },
    });
  }

  if (catalog.value?.id !== rootService.value?.rootId) {
    routes.push({
      name: '···',
    });
  }

  routes.push({
    name: prettifyBreadcrumbName(rootService.value?.name),
  });

  return routes;
});
const { close } = useClose(CrmSections.SERVICE_CATALOGS);

function edit(item) {
  return router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-services-card`,
    params: {
      catalogId: route.params?.id,
      rootId: route.params?.rootId,
      id: item.id,
    },
  });
}

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({ dataList, filters: filtersValue, error, isLoading });

const addNewService = () => {
  router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-services-card`,
    params: {
      catalogId: route.params?.catalogId,
      rootId: route.params?.rootId,
      id: 'new',
    },
  });
};

const loadRootService = async () => {
  rootService.value = await ServicesAPI.get({
    itemId: route.params.rootId,
  });
};

const loadCatalog = async () => {
  catalog.value = await ServiceCatalogsAPI.get({
    itemId: route.params.catalogId,
  });
};

const initializeBreadcrumbs = async () => {
  rootService.value = null;

  try {
    await loadCatalog();

    if (route.params.rootId !== route.params.catalogId) {
      await loadRootService();
    }
  } catch {
    router.push({ name: CrmSections.SERVICE_CATALOGS });
  }
};
const setRootForServices = () => {
  store.commit(`${baseNamespace}/table/SET`, {
    path: 'rootId',
    value: route.params.rootId,
  });
};

const loadServices = async () => {
  await initializeBreadcrumbs();
  setRootForServices();
  await restoreFilters();
};

const disableStateSwitcher = computed(() => (item) => {
  return checkDisableState(catalog.value, item);
});

onUnmounted(() => {
  flushSubscribers();
});

loadServices();

watch(
  () => route.params,
  async () => {
    await loadServices();
  },
);
</script>

<style scoped lang="scss">
.the-catalog-service {
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
