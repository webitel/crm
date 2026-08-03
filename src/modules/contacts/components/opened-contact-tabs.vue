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
      :fields="customFields"
      :store="useContactPermissionsStore"
      :parent-id="itemId"
    />
  </article>
</template>

<script setup lang="ts">
import { useCardTabs } from '@webitel/ui-sdk/composables';
import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { useExtensionFields } from '../../customization/modules/wt-type-extension/composable/useExtensionFields';
import { useContactEditAccessControl } from '../composables/useContactEditAccessControl';
import { CONTACT_VIEW_NAME } from '../router/contactViewName';
import { useContactCardStore } from '../stores/card/contactCardStore';
import { useContactPermissionsStore } from '../stores/permissions/contactPermissionsStore';

const contactCardStore = useContactCardStore();
const { itemId } = storeToRefs(contactCardStore as unknown as StoreGeneric);

const { hasContactEditAccess } = useContactEditAccessControl();

const { t } = useI18n();
const route = useRoute();

const { fields: customFields, getFields } = useExtensionFields({
	type: 'contacts',
});

getFields();
const currentCardRoute = computed(() => {
	return typeof route.name === 'string' &&
		route.name.includes(CONTACT_VIEW_NAME)
		? CONTACT_VIEW_NAME
		: CrmSections.Contacts;
});

const { hasReadAccess: hasCaseReadAccess } = useUserAccessControl({
	resource: WtObject.Case,
});

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
