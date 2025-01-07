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

const { t } = useI18n();

const baseNamespace = 'configuration/lookups/services';
const catalogNamespace = 'configuration/lookups/catalogs';

const {
  id: idCatalog,
  itemInstance: itemInstanceCatalog,
  ...restCatalogStore
} = useCardStore(catalogNamespace);

const { isNew: isNewCatalog, pathName: pathNameCatalog, initialize: initializeCatalog } = useCardComponent({
  ...restCatalogStore,
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
    },
    {
      name: pathName.value,
    },
  ];
});

const { close } = useClose('configuration');

initializeCatalog();
initialize();

onMounted(async () => {
  if(isNewCatalog.value)  {
    router.push({ name: CrmSections.SERVICE_CATALOGS})
  }

  store.dispatch(`${baseNamespace}/table/SELECT_ROOT`, {
    rootId: route.params?.id,
  })
});
</script>