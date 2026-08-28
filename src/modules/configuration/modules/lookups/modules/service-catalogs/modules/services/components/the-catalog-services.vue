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
            {{ t('lookups.service.service') }}
          </h3>
          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            :disabled:add="!hasCreateAccess"
            @click:add="addNewService"
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

          <wt-table
            v-show="dataList.length && !isLoading"
            :data="dataList"
            :headers="shownHeaders"
            :selected="selected"
            sortable
            @sort="updateSort"
            @update:selected="updateSelected"
          >
            <template #name="{ item }">
              <wt-item-link
                class="the-catalog-service__service-name"
                :link="{
                  name: `${CrmSections.ServiceCatalogs}-services`,
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
            <template #defaultPriority="{ item }">
              {{ displayText(item.defaultPriority?.name) }}
            </template>
            <template #assignee="{ item }">
              <wt-item-link
                v-if="item.assignee?.id"
                class="the-catalog-service__service-assignee"
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
            <template #state="{ item }">
              <wt-switcher
                :model-value="item.state"
                :disabled="!hasUpdateAccess || disableStateSwitcher(item)"
                @update:model-value="changeState(item, $event)"
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
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script lang="ts" setup>
import { ServiceCatalogsAPI, ServicesAPI } from '@webitel/api-services/api';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections, IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { displayText } from '@webitel/ui-sdk/utils';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { checkDisableState } from '../../../utils/checkDisableState';
import prettifyBreadcrumbName from '../../../utils/prettifyBreadcrumbName';
import { useCaseServicesDatalistStore } from '../stores';
import { buildServiceCrumbs, findServicePath } from '../utils/breadcrumbUtils';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

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

const tableStore = useCaseServicesDatalistStore();

const {
	dataList,
	selected,
	error,
	isLoading,
	page,
	size,
	next,
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
	addFilter,
	updateFilter,
	deleteFilter,
} = tableStore;

const path = computed(() => {
	const baseRoutes = [
		{
			name: t('crm'),
			route: '/start-page',
		},
		{
			name: t('startPage.configuration.name'),
			route: '/configuration',
		},
		{
			name: t('lookups.lookups'),
			route: '/configuration',
		},
		{
			name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
			route: '/configuration/lookups/service-catalogs',
		},
	];

	if (!catalog.value) return baseRoutes;

	const servicePath = findServicePath(route.params.rootId, catalog.value);

	const routes = [
		...baseRoutes,
		{
			name: prettifyBreadcrumbName(catalog.value.name),
			route: {
				name: `${CrmSections.ServiceCatalogs}-services`,
				params: {
					catalogId: catalog.value.id,
					rootId: catalog.value.id,
				},
			},
		},
		...buildServiceCrumbs(servicePath, route.params.catalogId),
	];

	return routes;
});

const { close } = useClose(CrmSections.ServiceCatalogs);

function edit(item) {
	return router.push({
		name: `${CrmSections.ServiceCatalogs}-services-card`,
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
} = useTableEmpty({
	dataList,
	filters: computed(() => filtersManager.value.getAllValues()),
	error,
	isLoading,
});

const addNewService = () => {
	router.push({
		name: `${CrmSections.ServiceCatalogs}-services-card`,
		params: {
			catalogId: route.params?.catalogId,
			rootId: route.params?.rootId,
			id: 'new',
		},
	});
};

const loadRootService = async () => {
	rootService.value = await ServicesAPI.get({
		itemId: route.params.rootId as string,
	});
};

const loadCatalog = async () => {
	catalog.value = await ServiceCatalogsAPI.get({
		itemId: route.params.catalogId as string,
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
		router.push({
			name: CrmSections.ServiceCatalogs,
		});
	}
};

const loadServices = async () => {
	await initializeBreadcrumbs();
	await initialize({
		parentId: route.params.rootId as string,
	});
};

const disableStateSwitcher = computed(() => (item) => {
	return checkDisableState(catalog.value, item);
});

const changeState = async (item, value) => {
	await ServicesAPI.patch({
		changes: {
			state: value,
		},
		id: item.id,
	});

	item.state = value;
};

loadServices();

watch(
	() => route.params,
	async () => {
		await loadServices();
	},
);
</script>

<style
  scoped
  lang="scss"
>
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
