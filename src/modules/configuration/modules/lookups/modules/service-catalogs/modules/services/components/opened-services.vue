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
            :namespace="cardNamespace"
            :is-new="isNew"
            :access="{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
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

<script setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { computed, onMounted } from 'vue';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { t } = useI18n();
const store = useStore();
const route = useRoute();
const router = useRouter();

const baseNamespace = 'configuration/lookups/services';
const catalogNamespace = 'configuration/lookups/catalogs';

const {
  id: idCatalog,
  itemInstance: itemInstanceCatalog,
  setId,
  loadItem,
  ...restCatalogStore
} = useCardStore(catalogNamespace);

const { pathName: pathNameCatalog } = useCardComponent({
  ...restCatalogStore,
  loadItem,
  id: idCatalog,
  itemInstance: itemInstanceCatalog,
});

const {
  namespace: cardNamespace,
  id,
  itemInstance,

  ...restStore
} = useCardStore(baseNamespace);

const { isNew, pathName, disabledSave, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});

const { hasSaveActionAccess, disableUserInput } = useAccessControl();

const path = computed(() => {
  return [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('lookups.serviceCatalogs.serviceCatalogs', 2), route: '/lookups/service-catalogs' },
    {
      name: pathNameCatalog.value,
      route: {
        name: `${CrmSections.SERVICE_CATALOGS}-services`,
        params: { id: catalogId.value }
      }
    },
    {
      name: isNew.value ? t('reusable.new') : pathName.value,
    },
  ];
});

const { close } = useClose('configuration');

const catalogId = computed(() => route.params.catalogId);

async function initializeCatalog() {
  try {
    if (catalogId.value) {
      await setId(catalogId.value);
      await loadItem();
    } else {

    }
  } catch (error) {
    throw error;
  }
}

initializeCatalog();
initialize();

onMounted(async () => {
  if(catalogId.value === 'new')  {
    router.push({ name: CrmSections.SERVICE_CATALOGS})
  }

  store.dispatch(`${baseNamespace}/card/SELECT_ROOT`, {
    rootId: catalogId.value,
  })
});
</script>