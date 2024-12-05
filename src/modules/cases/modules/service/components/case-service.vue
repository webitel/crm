<template>
  <case-service-popup
    :shown="isServicePopup"
    @close="isServicePopup = false"
    @save="addServiceToStore"
  />
  <div class="case-service">
    <div class="case-service__text-wrapper">
      <span class="case-service__title">{{ t('cases.service') }}</span>
      <span
        v-if="servicePath"
        class="case-service__path"
      >{{ servicePath }}</span>
    </div>
    <wt-button
      v-if="editMode"
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import CatalogAPI from '../api/CatalogAPI.js';
import ServiceAPI from '../api/ServiceAPI.js';
import CaseServicePopup from './case-service-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

const serviceNamespace = `${props.namespace}/service`;

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  setItemProp,
  deleteItem,
} = useCardStore(props.namespace);

const {
  isNew,
  pathName,
  disabledSave,
  saveText,
  save,
  initialize,
  initializeCard,
} = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
});

initializeComponent();

const { t } = useI18n();
const store = useStore();
const route = useRoute();
const isServicePopup = ref(false);
const servicePath = ref('');

function setServiceToStore(service) {
  store.dispatch(`${serviceNamespace}/SET_SERVICE`, service);
}

function setCatalogToStore(catalog) {
  store.dispatch(`${serviceNamespace}/SET_CATALOG`, catalog);
}

//TODO: refactor due to coderewiew and delete this
// це було прям дуже важко вичитати
// так виглядає, як наче краще десь в дані трансформувати в інші структури, щоб було зручно щось таке шукати
// Generates a hierarchical path for a service within a catalog.
function generateServicePath(service, catalog) {
  const path = [];
  const findParentService = (currentService, parentServices) => {
    for (const parent of parentServices) {
      if (parent.service?.some((child) => child.id === currentService.id)) return parent;
      const foundParent = parent.service && findParentService(currentService, parent.service);
      if (foundParent) return foundParent;
    }
    return null;
  };

  let currentService = service;
  while (currentService) {
    path.unshift(currentService.name);
    currentService = findParentService(currentService, catalog.service || []);
  }
  path.unshift(catalog.name);
  return path.join(' / ');
}

// Updates the store and component state with service and catalog data.
async function addServiceToStore(serviceCatalogData) {
  if (!serviceCatalogData) return console.error('No serviceCatalogData provided');
  try {
    const { service, catalog } = serviceCatalogData;
    setServiceToStore(service);
    setCatalogToStore(catalog);

    await setItemProp({
      path: 'service',
      value: { id: service.id, name: service.name },
    });

    servicePath.value = generateServicePath(service, catalog);
  } catch (err) {
    throw err;
  }
}

// Loads initial data for the component.
async function initializeComponent() {
  try {
    await initializeCard();
    const serviceId = itemInstance.value?.service?.id;
    if (serviceId) {
      const serviceResponse = await ServiceAPI.get({ itemId: serviceId });
      const catalogResponse = await CatalogAPI.get({ itemId: serviceResponse.catalogId });
      await addServiceToStore({ service: serviceResponse, catalog: catalogResponse });
    }
  } catch (err) {
    throw err;
  }
}

onUnmounted(() => {
  resetState();
});

</script>

<style lang="scss" scoped>
.case-service {
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: var(--spacing-sm);

  &__text-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__title, &__path {
    padding: var(--spacing-2xs);
  }

  &__path {
    @extend %typo-body-1;
  }

  &__title {
    @extend %typo-heading-4;
  }

  &__button {
    width: fit-content;
  }
}
</style>
