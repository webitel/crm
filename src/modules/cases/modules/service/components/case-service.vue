<template>
  <div class="case-service">
    <case-service-popup
      :value="serviceResponse"
      :shown="isServicePopup"
      @close="isServicePopup = false"
      @save="onServicePopupSave"
    />

    <sla-recalculation-popup
      :shown="isSlaRecalculationPopup"
      @close="isSlaRecalculationPopup = false"
      @save="onSlaRecalculationSave"
    />

    <div class="case-service__wrapper">
      <span class="case-service__title case-section-title">
        {{ t('cases.service') }}

        <wt-icon
          v-if="hasServiceValidationError"
          v-tooltip="t('cases.serviceValidation')"
          icon="attention"
          color="error"
        />
      </span>

      <service-path
        class="case-service__path typo-body-1"
        :service="itemInstance?.service"
        :catalog="catalogData"
      />
    </div>
    <wt-button
      v-if="editMode"
      :disabled="disableUserInput"
      class="case-service__button"
      color="success"
      @click="isServicePopup = true"
    >
      {{ t('cases.selectAService') }}
    </wt-button>
  </div>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, inject, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import CatalogAPI from '../api/CatalogAPI.js';
import ServiceAPI from '../api/ServiceAPI.js';
import CaseServicePopup from './case-service-popup.vue';
import ServicePath from './service-path.vue';
import SlaRecalculationPopup from './sla-recalculation-popup.vue';
import { CasePrioritiesAPI } from '@webitel/api-services/api';

const namespace = inject('namespace');
const editMode = inject('editMode');
const isReadOnly = inject('isReadOnly');

const { disableUserInput } = useUserAccessControl();

const {
	namespace: cardNamespace,
	itemInstance,
	setItemProp,
} = useCardStore(namespace);

const { isNew } = useCardComponent({
	itemInstance,
});

const { t } = useI18n();
const store = useStore();
const isServicePopup = ref(false);
const isSlaRecalculationPopup = ref(false);
const catalogData = ref(null);

const serviceNamespace = `${cardNamespace}/service`;

const hasServiceValidationError = computed(() => {
	if (isReadOnly) return false; // skip errors on read-only mode

	return !itemInstance?.value?.service?.name;
});

function setServiceToStore(service) {
	return store.dispatch(`${serviceNamespace}/SET_SERVICE`, service);
}

function setCatalogToStore(catalog) {
	return store.dispatch(`${serviceNamespace}/SET_CATALOG`, catalog);
}

// This function returns the defaultPriority for a selected service by traversing up the service hierarchy.
// It first checks the selected service, then its parent services using rootId,
// and finally falls back to the catalog-level defaultPriority if none is found.
const getDefaultPriority = (catalog, selectedService) => {
	const hasPriority = (obj) =>
		obj?.defaultPriority && Object.keys(obj.defaultPriority).length;

	if (hasPriority(selectedService)) {
		return selectedService.defaultPriority;
	}

	const findServiceById = (services, id) => {
		for (const service of services || []) {
			if (service.id === id) return service;

			const foundService = findServiceById(service.service, id);
			if (foundService) return foundService;
		}
		return null;
	};

	let current = selectedService;

	while (current?.rootId) {
		const parentService = findServiceById(catalog.service, current.rootId);

		if (!parentService) break;

		if (hasPriority(parentService)) {
			return parentService.defaultPriority;
		}

		current = parentService;
	}

	if (hasPriority(catalog)) {
		return catalog.defaultPriority;
	}

	return null;
};

const setDefaultPriority = async ({ catalog, service }) => {
	const defaultPriority = getDefaultPriority(catalog, service);

	if (defaultPriority) {
		// Set default priority from selected Service
		await setItemProp({
			path: 'priority',
			value: defaultPriority,
		});
	} else {
		const firstDefaultPriority = (await CasePrioritiesAPI.getLookup({}))
			.items[0];

		// Set first priority from get list case priorities
		await setItemProp({
			path: 'priority',
			value: firstDefaultPriority,
		});
	}
};

// Updates the store and component state with service and catalog data.
async function addServiceToStore(serviceCatalogData) {
	if (!serviceCatalogData)
		return console.error('No serviceCatalogData provided');

	const { service, catalog } = serviceCatalogData;
	await setServiceToStore(service);
	await setCatalogToStore(catalog);

	// Store catalog data for the service-path component
	catalogData.value = catalog;

	await setItemProp({
		path: 'close_reason_group',
		value: {
			id: catalog.closeReasonGroup.id,
		},
	});

	await setItemProp({
		path: 'service',
		value: {
			id: service.id,
			name: service.name,
		},
	});
}

/**
 * Flow for SLA recalculation:
 *   1. User picks a service in case-service-popup and emits { service, catalog }.
 *   2. We store that data temporarily in `pendingServiceData`, then open sla-recalculation-popup.
 *   3. Only if the user confirms in sla-recalculation-popup do we finalize the store update
 *      (via addServiceToStore) and recalculate SLA.
 *   4. If user cancels, no changes are saved.
 */
const pendingServiceData = ref(null);

function onServicePopupSave(serviceCatalogData) {
	pendingServiceData.value = serviceCatalogData;
	isServicePopup.value = false;

	if (isNew.value) {
		addServiceToStore(serviceCatalogData);
		setDefaultPriority(serviceCatalogData);
	} else {
		isSlaRecalculationPopup.value = true;
	}
}

async function onSlaRecalculationSave() {
	if (!pendingServiceData.value) return;

	await addServiceToStore(pendingServiceData.value);
	await setDefaultPriority(pendingServiceData.value);
	pendingServiceData.value = null;
	isSlaRecalculationPopup.value = false;
}

const serviceResponse = ref(null);

watch(
	() => itemInstance.value?.service?.id,
	async (newService) => {
		if (!newService) return;
		serviceResponse.value = await ServiceAPI.get({
			itemId: newService,
		});
		const catalogResponse = await CatalogAPI.get({
			itemId: serviceResponse.value.catalogId,
		});
		await addServiceToStore({
			service: serviceResponse.value,
			catalog: catalogResponse,
		});
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	setServiceToStore(null);
	setCatalogToStore(null);
	catalogData.value = null;
});
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-service {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: fit-content;

  &__wrapper {
    display: flex;
    flex-direction: column;
  }

  &__title,
  &__path {
    padding: var(--spacing-xs);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__button {
    width: fit-content;
  }
}
</style>
