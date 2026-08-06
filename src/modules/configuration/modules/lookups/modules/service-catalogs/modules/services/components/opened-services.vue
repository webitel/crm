<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="isPrimaryDisabled"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <wt-loader v-if="debouncedIsLoading" />
      <form
        v-else
        class="main-container"
        @submit.prevent="save"
      >
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            v-model="modelValue"
            :validation-fields="validationFields"
            :access="{ read: true, update: !disableUserInput, delete: !disableUserInput, create: !disableUserInput }"
          />
        </router-view>

        <input
          hidden
          type="submit"
        > <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script lang="ts" setup>
import { ServiceCatalogsAPI, ServicesAPI } from '@webitel/api-services/api';
import type { WebitelCasesService } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import prettifyBreadcrumbName from '../../../utils/prettifyBreadcrumbName.js';
import { useCaseServicesCardStore } from '../stores';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const {
	modelValue,

	debouncedIsLoading,
	originalItemInstance,

	isNew,
	saveText,
	hasValidationErrors,
	isAnyFieldEdited,
	validationFields,

	save: saveCard,
} = useCardComponent<WebitelCasesService>({
	useCardStore: useCaseServicesCardStore,
});

const rootId = computed(() => route.params.rootId as string);
const catalogId = computed(() => route.params.catalogId as string);

const isPrimaryDisabled = computed(
	() =>
		!hasSaveActionAccess.value ||
		!isAnyFieldEdited.value ||
		hasValidationErrors.value,
);

const save = async () => {
	modelValue.value.rootId = rootId.value;
	modelValue.value.catalogId = catalogId.value;

	await saveCard();
};

const rootService = ref(null);
const catalog = ref(null);

const loadRootService = async () => {
	rootService.value = await ServicesAPI.get({
		itemId: rootId.value,
	});
};

const loadCatalog = async () => {
	catalog.value = await ServiceCatalogsAPI.get({
		itemId: catalogId.value,
	});
};

const path = computed(() => {
	const routes: {
		name?: string;
		route?: RouteLocationRaw;
	}[] = [
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

	routes.push({
		name: prettifyBreadcrumbName(catalog.value?.name),
		route: {
			name: `${CrmSections.ServiceCatalogs}-services`,
			params: {
				catalogId: catalog.value?.id,
				rootId: catalog.value?.id,
			},
		},
	});

	if (route.params.rootId === route.params.catalogId) {
		routes.push({
			name: isNew.value
				? t('reusable.new')
				: prettifyBreadcrumbName(originalItemInstance.value?.name),
		});

		return routes;
	}

	if (catalog.value?.id !== rootService.value?.rootId) {
		routes.push({
			name: '···',
		});
	}

	routes.push({
		name: prettifyBreadcrumbName(rootService.value?.name),
		route: {
			name: `${CrmSections.ServiceCatalogs}-services`,
			params: {
				catalogId: catalogId.value,
				rootId: rootId.value,
			},
		},
	});

	routes.push({
		name: isNew.value
			? t('reusable.new')
			: prettifyBreadcrumbName(originalItemInstance.value?.name),
	});

	return routes;
});

const close = () => {
	if (window.history.length === 1) window.close();
	return router.push({
		name: `${CrmSections.ServiceCatalogs}-services`,
		params: {
			catalogId: catalogId.value,
			rootId: rootId.value,
		},
	});
};

const initializeBreadcrumbs = async () => {
	rootService.value = null;

	try {
		await loadCatalog();
		if (rootId.value !== catalogId.value) {
			await loadRootService();
		}
	} catch {
		router.push({
			name: CrmSections.ServiceCatalogs,
		});
	}
};

onMounted(async () => {
	await initializeBreadcrumbs();
});
</script>
