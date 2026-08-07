<template>
  <article class="opened-card-tabs wt-scrollbar">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    />
    <router-view
      v-slot="{ Component }"
      class="opened-card-tabs__tab"
    >
      <keep-alive>
        <component
          :is="Component"
          :access="/*is used by permissions tab*/{
            read: true,
            update: actionAllow,
            delete: actionAllow,
            create: actionAllow,
          }"
          :fields="customFields"
          :store="useCasePermissionsStore"
          :parent-id="itemId"
        />
      </keep-alive>
    </router-view>
  </article>
</template>

<script setup lang="ts">
import { type CardTab, useCardTabs } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { type ComputedRef, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../composables/useCaseAccessState';
import { CASE_VIEW_NAME } from '../router/caseViewName';
import { useCasesCardStore } from '../stores/card/casesCardStore';
import { useCasePermissionsStore } from '../stores/permissions/casePermissionsStore';

const { editMode, isReadOnly } = useCaseAccessState();
const customFields =
	inject<ComputedRef<Array<Record<string, any>>>>('customFields');

const { t } = useI18n();
const route = useRoute();

const { disableUserInput } = useUserAccessControl();

const casesCardStore = useCasesCardStore();
const { itemId } = storeToRefs(casesCardStore as unknown as StoreGeneric);

const actionAllow = computed(
	() => !disableUserInput.value && editMode.value && !isReadOnly,
);

const currentCardRoute = computed(() => {
	return typeof route.name === 'string' && route.name.includes(CASE_VIEW_NAME)
		? CASE_VIEW_NAME
		: CrmSections.Cases;
});

const tabs = computed<CardTab[]>(() => {
	const tabs = [
		{
			text: t('cases.caseInfo.caseInfo'),
			value: 'case-info',
			pathName: `${currentCardRoute.value}-case-info`,
		},
		{
			text: t('cases.result'),
			value: 'result',
			pathName: `${currentCardRoute.value}-result`,
		},
		{
			text: t('cases.attachments.attachments'),
			value: 'attachments',
			pathName: `${currentCardRoute.value}-attachments`,
		},
	];

	const timeline = {
		text: t('timeline.timeline'),
		value: 'timeline',
		pathName: `${currentCardRoute.value}-timeline`,
	};

	if (itemId.value) tabs.push(timeline);

	if (customFields.value.length) {
		tabs.push({
			text: t('cases.details.details'),
			value: 'details',
			pathName: `${currentCardRoute.value}-details`,
		});
	}

	const permissions = {
		text: t('vocabulary.permissions', 2),
		value: 'permissions',
		pathName: `${currentCardRoute.value}-permissions`,
	};

	if (itemId.value) tabs.push(permissions);

	return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/styleguide/scroll' as *;

.opened-card-tabs {
  height: 100%;
  overflow: auto;
}
</style>
