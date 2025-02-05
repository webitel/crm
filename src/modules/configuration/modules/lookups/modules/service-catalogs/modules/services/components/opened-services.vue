<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!hasSaveActionAccess"
        :primary-action="save"
        :primary-disabled="disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :v="v$"
            :namespace="cardNamespace"
            :access="{
              read: true,
              edit: !disableUserInput,
              delete: !disableUserInput,
              add: !disableUserInput,
            }"
          />
        </router-view>
        <input
          hidden
          type="submit"
        />
        <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import CatalogsAPI from '../../../api/service-catalogs.js';
import prettifyBreadcrumbName from '../../../utils/prettifyBreadcrumbName.js';
import ServicesAPI from '../api/services.js';

const { t } = useI18n();
const store = useStore();
const route = useRoute();
const router = useRouter();

const baseNamespace = 'configuration/lookups/services';

const {
  namespace: cardNamespace,
  id,
  itemInstance,

  ...restStore
} = useCardStore(baseNamespace);

const v$ = useVuelidate(
  {
    itemInstance: {
      name: { required },
    },
  },
  { itemInstance },
  { $autoDirty: true },
);

v$.value.$touch();
const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value._dirty,
);

const { isNew, pathName, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});

const rootService = ref(null);
const catalog = ref(null);

const loadRootService = async () => {
  rootService.value = await ServicesAPI.get({
    itemId: rootId.value,
  });
};

const loadCatalog = async () => {
  catalog.value = await CatalogsAPI.get({
    itemId: catalogId.value,
  });
};

const { hasSaveActionAccess, disableUserInput } = useAccessControl();

const path = computed(() => {
  const routes = [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    {
      name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
      route: '/lookups/service-catalogs',
    },
  ];

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

  if (route.params.rootId === route.params.catalogId) {
    routes.push({
      name: isNew.value ? t('reusable.new') : pathName.value,
    });

    return routes;
  }

  if (catalog.value?.id !== rootService.value?.rootId) {
    routes.push({
      name: '···',
    });
  }

  routes.push({
    name: rootService.value?.name,
    route: {
      name: `${CrmSections.SERVICE_CATALOGS}-services`,
      params: { catalogId: catalogId.value, rootId: rootId.value },
    },
  });

  routes.push({
    name: isNew.value ? t('reusable.new') : pathName.value,
  });

  return routes;
});

const close = () => {
  if (window.history.length === 1) window.close();
  return router.push({
    name: `${CrmSections.SERVICE_CATALOGS}-services`,
    params: { catalogId: catalogId.value, rootId: rootId.value },
  });
};

const rootId = computed(() => route.params.rootId);
const catalogId = computed(() => route.params.catalogId);

const initializeBreadcrumbs = async () => {
  rootService.value = null;

  try {
    await loadCatalog();
    if (rootId.value !== catalogId.value) {
      await loadRootService();
    }
  } catch {
    router.push({ name: CrmSections.SERVICE_CATALOGS });
  }
};

const setCatalogAndRootService = () => {
  store.commit(`${baseNamespace}/card/SET`, {
    path: 'rootId',
    value: rootId.value,
  });
  store.commit(`${baseNamespace}/card/SET`, {
    path: 'catalogId',
    value: catalogId.value,
  });
};

initialize();

onMounted(async () => {
  await initializeBreadcrumbs();
  setCatalogAndRootService();
});
</script>
