<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!hasSaveActionAccess || !isAnyFieldEdited || hasValidationErrors"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <wt-loader v-if="debouncedIsLoading" />
      <form
        v-else
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
            v-model="modelValue"
            :validation-fields="validationFields"
            :group-id="itemId"
            :access="{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
          />
        </router-view>

        <input
          hidden
          type="submit"
        />
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script lang="ts" setup>
import type { ContactsGroup } from '@webitel/api-services/gen/models';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useCardTabs, useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useContactGroupsCardStore } from '../stores';
import { useRoute } from 'vue-router';
import { DynamicGroupsAPI } from '@webitel/api-services/api';

const { t } = useI18n();
const { handleError } = useErrorRedirectHandler();
const store = useStore();
const route = useRoute();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const { itemId } = storeToRefs(useContactGroupsCardStore());

const customSaveItem = async (
	data: ContactsGroup,
): Promise<ContactsGroup | null> => {
	if (data.type !== ContactsGroupType.Dynamic) {
		return null;
	}

	if (!itemId.value) {
		return DynamicGroupsAPI.add({
			itemInstance: data,
		});
	} else {
		return DynamicGroupsAPI.update({
			itemInstance: data,
			itemId: itemId.value,
		});
	}
};

const {
	modelValue,

	debouncedIsLoading,
	originalItemInstance,

	isNew,
	saveText,
	hasValidationErrors,
	isAnyFieldEdited,
	validationFields,

	save,
} = useCardComponent<ContactsGroup>({
	useCardStore: useContactGroupsCardStore,
	onLoadErrorHandler: handleError,
	initialData:
		route.params.id === 'new'
			? {
					type: route.query.type?.toString().toUpperCase() as ContactsGroupType,
				}
			: undefined,
	customSaveItem,
});

const { close } = useClose(CrmSections.ContactGroups);

const isDynamicGroup = computed(
	() => modelValue.value?.type === ContactsGroupType.Dynamic,
);

const tabs = computed(() => {
	const general = {
		text: t('reusable.general'),
		value: 'general',
		pathName: `${CrmSections.ContactGroups}-general`,
	};

	const contacts = {
		text: t('vocabulary.contact', 2),
		value: 'contacts',
		pathName: `${CrmSections.ContactGroups}-contacts`,
	};

	const conditions = {
		text: t('lookups.slas.conditions', 2),
		value: 'conditions',
		pathName: `${CrmSections.ContactGroups}-conditions`,
	};

	const permissions = {
		text: t('vocabulary.permissions', 2),
		value: 'permissions',
		pathName: `${CrmSections.ContactGroups}-permissions`,
	};

	const tabs = [
		general,
	];

	if (!isNew.value) {
		tabs.push(isDynamicGroup.value ? conditions : contacts);
		tabs.push(permissions);
	}

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
			name: t('lookups.contactGroups.contactGroups', 2),
			route: '/configuration/lookups/contact-groups',
		},
		{
			name: isNew.value ? t('reusable.new') : originalItemInstance.value?.name,
		},
	];
});
</script>

<style lang="scss" scoped></style>
