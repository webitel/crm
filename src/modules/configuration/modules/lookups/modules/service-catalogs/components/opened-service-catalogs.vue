<template>
  <wt-page-wrapper :actions-panel="!!currentTab.filters">
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!hasSaveActionAccess || disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>

    <template #actions-panel>
      <component
        :is="currentTab.filters"
        :namespace="namespace"
      />
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
            :access="/*is used by permissions tab*/{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
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
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import prettifyBreadcrumbName from '../utils/prettifyBreadcrumbName.js';

const namespace = 'configuration/lookups/catalogs';
const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();
const { handleError } = useErrorRedirectHandler();

const {
	namespace: cardNamespace,
	id,
	itemInstance,
	resetState,
	...restStore
} = useCardStore(namespace, {
	onLoadErrorHandler: handleError,
});

const v$ = useVuelidate(
	computed(() => ({
		itemInstance: {
			name: {
				required,
			},
			sla: {
				required,
			},
			prefix: {
				required,
			},
			closeReasonGroup: {
				required,
			},
			status: {
				required,
			},
		},
	})),
	{
		itemInstance,
	},
	{
		$autoDirty: true,
	},
);

v$.value.$touch();

const { isNew, pathName, saveText, save, initialize } = useCardComponent({
	...restStore,
	id,
	itemInstance,
	resetState,
	onLoadErrorHandler: handleError,
});

const { close } = useClose(CrmSections.ServiceCatalogs);

const disabledSave = computed(
	() => v$.value?.$invalid || !itemInstance.value._dirty,
);

const tabs = computed(() => {
	const general = {
		text: t('reusable.general'),
		value: 'general',
		pathName: `${CrmSections.ServiceCatalogs}-general`,
	};

	const tabs = [
		general,
	];

	return tabs;
});

const { currentTab } = useCardTabs(tabs);

const path = computed(() => {
	return [
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
		{
			name: isNew.value
				? t('reusable.new')
				: prettifyBreadcrumbName(pathName.value),
		},
	];
});

initialize();

onMounted(() => {
	if (isNew.value) {
		resetState();
	}
});
</script>

<style
  scoped
  lang="scss"
></style>
