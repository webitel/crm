<template>
  <wt-dual-panel
    v-if="!debouncedIsLoading"
    :actions-panel="false"
    :hide-header="isReadOnly"
    class="opened-case"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!isNew && !isEditable"
        :primary-action="saveCase"
        :primary-disabled="!hasSaveActionAccess || disabledSave"
        :primary-text="t('reusable.save')"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />

        <template #actions>
          <div class="opened-case__actions-wrapper">
            <wt-button
              :disabled="!isCaseAssignable"
              color="success"
              @click="assignCaseToMe"
            >
              {{ t('cases.assignToMe') }}
            </wt-button>

            <wt-button
              v-if="!isNew && !isEditable"
              :disabled="!hasUpdateAccess"
              color="secondary"
              @click="toggleEditMode(true)"
            >
              {{ t('reusable.edit') }}
            </wt-button>
          </div>
        </template>
      </wt-page-header>
    </template>

    <template #side-panel>
      <opened-case-general :is-new="isNew" />
    </template>

    <template #main>
      <opened-case-tabs />
    </template>
  </wt-dual-panel>
</template>

<script
  lang="ts"
  setup
>
import { CasesAPI, UsersAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useCachedItemInstanceName } from '@webitel/ui-sdk/src/composables/useCachedItemInstanceName/useCachedItemInstanceName';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { useExtensionFields } from '../../customization/modules/wt-type-extension/composable/useExtensionFields';
import { useErrorRedirectHandler } from '../../error-pages/composable/useErrorRedirectHandler';
import { useUserinfoStore } from '../../userinfo/store/userinfoStore';
import { useCaseAccessState } from '../composables/useCaseAccessState';
import { caseCustomFields } from '../stores/_internals/caseCustomFields';
import { useCasesCardStore } from '../stores/card/casesCardStore';
import { useCasesEditModeStore } from '../stores/card/casesEditModeStore';
import OpenedCaseGeneral from './opened-case-general.vue';
import OpenedCaseTabs from './opened-case-tabs.vue';

const { t } = useI18n();
const { handleError } = useErrorRedirectHandler();

const { fields: customFields, getFields } = useExtensionFields({
	type: 'cases',
});

getFields();
watch(
	customFields,
	(fields) => {
		caseCustomFields.value = fields;
	},
	{
		immediate: true,
	},
);

const { isEditable, isReadOnly } = useCaseAccessState();

const { hasUpdateAccess, hasSaveActionAccess } = useUserAccessControl();

const casesCardStore = useCasesCardStore();
const { itemId } = storeToRefs(casesCardStore as unknown as StoreGeneric);

const {
	modelValue: itemInstance,
	debouncedIsLoading,
	originalItemInstance,
	isNew,
	hasValidationErrors,
	isAnyFieldEdited,
	save: saveCardStore,
} = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	onLoadErrorHandler: handleError,
});

const disabledSave = computed(
	() => hasValidationErrors.value || !isAnyFieldEdited.value,
);

const { setEditMode } = useCasesEditModeStore();

const toggleEditMode = (value: boolean) => {
	setEditMode(value);
};

/**
 * [WTEL-6779] (https://webitel.atlassian.net/browse/WTEL-6779)
 *
 * In readonly mode we have an etag as the route param, and some tabs can't
 * get data from an etag, so we need to set the real id from the card's get
 * response.
 * */
watch(
	() => originalItemInstance.value?.id,
	(value) => {
		if (value && isReadOnly) {
			casesCardStore.itemId = value;
		}
	},
);

const { close } = useClose(CrmSections.Cases);

const { name: breadcrumbSubject } = useCachedItemInstanceName(itemInstance, {
	namePath: 'subject',
});

const path = computed(() => {
	const baseUrl = '/cases';

	return [
		{
			name: t('crm'),
			route: '/start-page',
		},
		{
			name: t('cases.case', 2),
			route: baseUrl,
		},
		{
			name: itemId.value
				? `${itemInstance.value?.name} ${breadcrumbSubject.value}`
				: t('reusable.new'),
		},
	];
});

const { userId } = useUserinfoStore();
const userContact = ref<{
	id?: string;
	name?: string;
}>({});

const isCaseAssignable = computed(() => {
	return (
		userContact.value.id &&
		itemInstance.value.assignee?.id !== userContact.value.id
	);
});

async function fetchUserContact(userId) {
	if (!userId) {
		userContact.value = {};
		return;
	}
	const user = await UsersAPI.get({
		itemId: userId,
	});
	userContact.value = user?.contact || {};
}

watch(
	() => userId,
	async (newVal, oldVal) => {
		if (newVal !== oldVal) {
			await fetchUserContact(newVal);
		}
	},
	{
		immediate: true,
	},
);

async function assignCaseToMe() {
	if (!userContact.value?.id) {
		return;
	}

	if (isEditable.value) {
		itemInstance.value.assignee = {
			id: userContact.value.id,
			name: userContact.value.name,
		};
	} else {
		try {
			await CasesAPI.patch({
				changes: {
					assignee: {
						id: userContact.value.id,
						name: userContact.value.name,
					},
				},
				etag: itemInstance.value.etag,
			});
		} finally {
			await casesCardStore.initialize({
				itemId: itemId.value,
			});
		}
	}
}

const saveCase = async () => {
	await saveCardStore();
	await toggleEditMode(false);
};

onUnmounted(() => {
	toggleEditMode(false);
});
</script>

<style
  lang="scss"
  scoped
>
.opened-case {
  &__actions-wrapper {
    display: flex;
    gap: var(--spacing-sm);
  }
}
</style>
