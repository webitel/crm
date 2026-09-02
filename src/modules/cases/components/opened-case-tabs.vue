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
          :fields="caseCustomFields"
          :store="useCasePermissionsStore"
          :parent-id="itemId"
          :item-instance="draftItemInstance"
          :validation-fields="validationFields"
        />
      </keep-alive>
    </router-view>
  </article>
</template>

<script setup lang="ts">
import { type CardTab, useCardTabs } from '@webitel/ui-datalist/card';
import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../composables/useCaseAccessState';
import { CASE_VIEW_NAME } from '../router/caseViewName';
import { caseCustomFields } from '../stores/_internals/caseCustomFields';
import { useCasesCardStore } from '../stores/card/casesCardStore';
import { useCasePermissionsStore } from '../stores/permissions/casePermissionsStore';

const props = defineProps<{
	validationFields?: Record<string, any>;
}>();

const { isEditable, isReadOnly } = useCaseAccessState();

const { t } = useI18n();
const route = useRoute();

const { disableUserInput } = useUserAccessControl();
const { hasReadAccess: hasRolesReadAccess } = useUserAccessControl(
	WtObject.Role,
);

provide('hasRolesReadAccess', hasRolesReadAccess);

const casesCardStore = useCasesCardStore();
const { itemId, draftItemInstance } = storeToRefs(casesCardStore);

const actionAllow = computed(
	() => !disableUserInput.value && isEditable.value && !isReadOnly,
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

	if (caseCustomFields.value.length) {
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
