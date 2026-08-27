<template>
  <article class="opened-contact-tabs">
    <wt-tabs
      :current="currentTab"
      :tabs="tabs"
      @change="changeTab"
    />
    <router-view
      class="opened-contact-tab"
      :access="/*is used by permissions tab*/{
        read: true,
        update: hasContactEditAccess,
        delete: hasContactEditAccess,
        create: hasContactEditAccess,
      }"
      :store="useContactPermissionsStore"
      :parent-id="itemId"
      :item-instance="draftItemInstance"
      :validation-fields="validationFields"
    />
  </article>
</template>

<script setup lang="ts">
import { useCardTabs } from '@webitel/ui-datalist/card';
import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, provide, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { useExtensionFields } from '../../configuration/modules/customization/modules/field-extensions/composables/useExtensionFields';
import { useContactEditAccessControl } from '../composables/useContactEditAccessControl';
import { CONTACT_VIEW_NAME } from '../router/contactViewName';
import { contactCustomFields } from '../stores/_internals/contactCustomFields';
import { useContactCardStore } from '../stores/card/contactCardStore';
import { useContactPermissionsStore } from '../stores/permissions/contactPermissionsStore';

const contactCardStore = useContactCardStore();
const { itemId, draftItemInstance, validationFields } = storeToRefs(
	contactCardStore as unknown as StoreGeneric,
);

const { hasContactEditAccess } = useContactEditAccessControl();

const { t } = useI18n();
const route = useRoute();

const { fields: customFields, getFields } = useExtensionFields({
	type: 'contacts',
});

getFields();
watch(
	customFields,
	(fields) => {
		contactCustomFields.value = fields;
	},
	{
		immediate: true,
	},
);
const currentCardRoute = computed(() => {
	return typeof route.name === 'string' &&
		route.name.includes(CONTACT_VIEW_NAME)
		? CONTACT_VIEW_NAME
		: CrmSections.Contacts;
});

const { hasReadAccess: hasCaseReadAccess } = useUserAccessControl({
	resource: WtObject.Case,
});
const { hasReadAccess: hasRolesReadAccess } = useUserAccessControl({
	resource: WtObject.Role,
});

provide('hasRolesReadAccess', hasRolesReadAccess);

const tabs = computed(() => {
	const tabList = [
		{
			text: t('timeline.timeline'),
			value: 'timeline',
			pathName: `${currentCardRoute.value}-timeline`,
		},
		{
			text: t('contacts.communications.communications', 2),
			value: 'communications',
			pathName: `${currentCardRoute.value}-communications`,
		},
		{
			text: t('contacts.attributes', 2),
			value: 'variables',
			pathName: `${currentCardRoute.value}-variables`,
		},
	];

	if (hasCaseReadAccess.value) {
		tabList.splice(1, 0, {
			text: t('cases.case', 2),
			value: 'cases',
			pathName: `${currentCardRoute.value}-cases`,
		});
	}

	if (customFields.value.length) {
		tabList.push({
			text: t('contacts.details'),
			value: 'details',
			pathName: `${currentCardRoute.value}-details`,
		});
	}

	tabList.push({
		text: t('vocabulary.permissions', 2),
		value: 'permissions',
		pathName: `${currentCardRoute.value}-permissions`,
	});

	return tabList;
});

const { currentTab, changeTab } = useCardTabs(tabs);
</script>

<style
  lang="scss"
  scoped
>
.opened-contact-tabs {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  min-width: 0;
  padding: var(--spacing-sm);
  box-shadow: var(--elevation-10);

  .opened-contact-tab {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}
</style>
