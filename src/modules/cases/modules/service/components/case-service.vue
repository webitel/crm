<template>
  <div class="case-service">
    <case-service-popup
      :value="serviceResponse"
      :shown="isServicePopup"
      @close="isServicePopup = false"
      @save="addServiceToStore"
    />
    <div class="case-service__wrapper">
      <span class="case-service__title">
        {{ t('cases.service') }}

        <wt-tooltip v-if="!servicePath">
          <template #activator>
            <wt-icon
              icon="attention"
              color="error"
            />
          </template>

            {{ t('validation.required') }}
        </wt-tooltip>
      </span>
      <span
        v-if="servicePath"
        class="case-service__path"
        >{{ servicePath }}</span
      >
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
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { inject, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';

import CatalogAPI from '../api/CatalogAPI.js';
import ServiceAPI from '../api/ServiceAPI.js';
import CaseServicePopup from './case-service-popup.vue';

const namespace = inject('namespace');
const editMode = inject('editMode');

const { disableUserInput } = useUserAccessControl();

const {
  namespace: cardNamespace,
  itemInstance,
  resetState,
  setItemProp,
} = useCardStore(namespace);

const { t } = useI18n();
const store = useStore();
const isServicePopup = ref(false);
const servicePath = ref('');

const serviceNamespace = `${cardNamespace}/service`;

function setServiceToStore(service) {
  return store.dispatch(`${serviceNamespace}/SET_SERVICE`, service);
}

function setCatalogToStore(catalog) {
  return store.dispatch(`${serviceNamespace}/SET_CATALOG`, catalog);
}

// Finds the parent service for the given service within a catalog.
function findParentService(currentService, parentServices) {
  for (const parent of parentServices) {
    if (parent.service?.some((child) => child.id === currentService.id))
      return parent;
    const foundParent =
      parent.service && findParentService(currentService, parent.service);
    if (foundParent) return foundParent;
  }
  return null;
}

// Builds the hierarchical path for the service within the catalog.
function buildServicePath(service, catalog) {
  const path = [];
  let currentService = service;

  while (currentService) {
    path.unshift(currentService.name);
    currentService = findParentService(currentService, catalog.service || []);
  }

  path.unshift(catalog.name);
  return path;
}

// Generates the service path as a string.
function generateServicePath(service, catalog) {
  if (!service || !catalog) {
    console.error('Invalid service or catalog data');
    return '';
  }

  const pathArray = buildServicePath(service, catalog);
  return pathArray.join(' / ');
}

// Updates the store and component state with service and catalog data.
async function addServiceToStore(serviceCatalogData) {
  if (!serviceCatalogData)
    return console.error('No serviceCatalogData provided');

  const { service, catalog } = serviceCatalogData;
  await setServiceToStore(service);
  await setCatalogToStore(catalog);

  await setItemProp({
    path: 'close_reason_group',
    value: { id: catalog.closeReasonGroup.id },
  });

  await setItemProp({
    path: 'service',
    value: { id: service.id, name: service.name },
  });

  servicePath.value = generateServicePath(service, catalog);
}

const serviceResponse = ref(null);

watch(
  () => itemInstance.value?.service?.id,
  async (newService) => {
    if (!newService) return;
    serviceResponse.value = await ServiceAPI.get({ itemId: newService });
    const catalogResponse = await CatalogAPI.get({
      itemId: serviceResponse.value.catalogId,
    });
    await addServiceToStore({
      service: serviceResponse.value,
      catalog: catalogResponse,
    });
  }, { immediate: true },
);

onUnmounted(() => {
  setServiceToStore(null);
  setCatalogToStore(null);
  resetState();
});
</script>

<style lang="scss" scoped>
.case-service {
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: var(--spacing-xs);

  &__wrapper {
    display: flex;
    flex-direction: column;
  }

  &__title,
  &__path {
    padding: var(--spacing-xs);
  }

  &__path {
    @extend %typo-body-1;
  }

  &__title {
    @extend %typo-heading-4;

    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__button {
    width: fit-content;
  }
}
</style>
