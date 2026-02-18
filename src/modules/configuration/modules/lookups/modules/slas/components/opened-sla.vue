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
        :namespace="SLANamespace"
      />
    </template>

    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @change="changeTab"
        />
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
        > <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { maxValue, minValue, required } from '@vuelidate/validators';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { SLANamespace } from '../namespace.js';

const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();
const { handleError } = useErrorRedirectHandler();

const {
	namespace: cardNamespace,
	id,
	itemInstance,
	...restStore
} = useCardStore(SLANamespace, {
	onLoadErrorHandler: handleError,
});

const v$ = useVuelidate(
	computed(() => ({
		itemInstance: {
			name: {
				required,
			},
			calendar: {
				required,
			},
			reactionTime: {
				required,
				minValue: minValue(1),
			},
			resolutionTime: {
				required,
				minValue: minValue(1),
			},
			// The values can't be equal, so I subtract 1 minute for that.
			// @author @Lera24
			// https://webitel.atlassian.net/browse/WTEL-8635
			validFrom: {
				maxValue: maxValue(itemInstance.value.validTo - 60000),
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
	onLoadErrorHandler: handleError,
});

const { close } = useClose(CrmSections.Slas);
const disabledSave = computed(
	() => v$.value?.$invalid || !itemInstance.value._dirty,
);

const tabs = computed(() => {
	const general = {
		text: t('reusable.general'),
		value: 'general',
		pathName: `${CrmSections.Slas}-general`,
	};
	const conditions = {
		text: t('lookups.slas.conditions', 2),
		value: 'conditions',
		pathName: `${CrmSections.Slas}-conditions`,
	};

	const tabs = [
		general,
	];

	if (id.value) tabs.push(conditions);
	return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);

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
			name: t('lookups.slas.slas', 2),
			route: '/configuration/lookups/slas',
		},
		{
			name: isNew.value ? t('reusable.new') : pathName.value,
		},
	];
});

initialize();
</script>

<style
  lang="scss"
  scoped
></style>
