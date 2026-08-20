<template>
  <div class="case-persons">
    <span class="case-persons__title case-section-title">{{ t('cases.persons') }}</span>
    <div class="case-persons__wrapper">
      <editable-field
        :model-value="modelValue.createdBy?.name || userInfo?.name"
        color="info"
        icon="case-author"
        horizontal-view
      />

      <editable-field
        :edit-mode="isEditable"
        :label="t('cases.reporter')"
        :link="getContactLinkPreview(modelValue.reporter?.id)"
        :model-value="modelValue.reporter"
        color="info"
        icon="reporter"
        horizontal-view
        required
        @update:model-value="handleReporterInput"
        @open-link="getContactLink(modelValue.reporter?.id)"
      >
        <template #default="props">
          <wt-single-select
            v-bind="props"
            :model-value="props.modelValue"
            :search-method="getContactsLookup"
            :disabled="disableUserInput"
            :regle-validation="validationFields.reporter"
            class="case-persons__select"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        v-model="modelValue.impacted"
        :edit-mode="isEditable"
        :label="t('cases.impacted')"
        :link="getContactLinkPreview(modelValue.impacted?.id)"
        icon="impacted"
        horizontal-view
        @open-link="getContactLink(modelValue.impacted?.id)"
      >
        <template #default="props">
          <wt-single-select
            v-bind="props"
            :model-value="props.modelValue"
            :disabled="disableUserInput"
            :search-method="ContactsAPI.getLookup"
            class="case-persons__select"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="isEditable"
        :label="t('cases.assignee')"
        :link="getContactLinkPreview(modelValue.assignee?.id)"
        :model-value="modelValue.assignee"
        color="success"
        icon="assignee"
        horizontal-view
        @update:model-value="modelValue.assignee = { id: $event.id, name: $event.name }"
        @open-link="getContactLink(modelValue.assignee?.id)"
      >
        <template #default="props">
          <wt-single-select
            :search-method="ContactsAPI.getLookup"
            :disabled="disableUserInput || isAssignMeDisabled"
            class="case-persons__select"
            v-bind="props"
            :model-value="props.modelValue"
            @update:model-value="props.updateValue($event)"
            @reset="resetAssignee"
          />
        </template>
      </editable-field>

      <editable-field
        v-model="modelValue.group"
        :edit-mode="isEditable"
        :label="t('cases.groupPerformers')"
        :disabled="disableUserInput"
        color="success"
        icon="group"
        horizontal-view
      >
        <template #default="props">
          <wt-single-select
            :disabled="disableUserInput"
            :search-method="loadStaticContactGroupsList"
            class="case-persons__select"
            v-bind="props"
            :model-value="props.modelValue"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContactGroupsAPI, ContactsAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { isEmpty } from '@webitel/ui-sdk/src/scripts/index';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import { CONTACT_VIEW_NAME } from '../../../../contacts/router/contactViewName';
import { useUserinfoStore } from '../../../../userinfo/store/userinfoStore';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import EditableField from '../../case-info/components/editable-field.vue';
import { useCaseServiceStore } from '../../service/stores/caseServiceStore';

const { t } = useI18n();
const router = useRouter();

const { isEditable, isReadOnly } = useCaseAccessState();

const { disableUserInput } = useUserAccessControl();

const { itemId } = storeToRefs(useCasesCardStore() as unknown as StoreGeneric);
const { modelValue, validationFields } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});

const isNew = computed(() => !itemId.value);

function loadStaticContactGroupsList(params) {
	return ContactGroupsAPI.getLookup({
		...params,
		type: ContactsGroupType.Static,
		enabled: true,
	});
}

const { userInfo } = useUserinfoStore();

const {
	serviceId,
	group: serviceGroup,
	assignee: serviceAssignee,
} = storeToRefs(useCaseServiceStore());

function handleReporterInput(value) {
	modelValue.value.reporter = value;

	if (isEmpty(modelValue.value.impacted)) {
		modelValue.value.impacted = value;
	}
}

const isAssignMeDisabled = ref(false);

function resetAssignee(value = undefined) {
	modelValue.value.assignee = value;
}

watch(
	[
		serviceId,
		serviceGroup,
		serviceAssignee,
	],
	([newServiceId, newGroup, newAssignee], [oldServiceId]) => {
		// this if statement needed so when we enter old case we don't reset assignee and group
		if ((oldServiceId && newServiceId !== oldServiceId) || isNew.value) {
			// @author @Lera24
			// [WTEL-7279] (https://webitel.atlassian.net/browse/WTEL-7279)
			if (modelValue.value.statusCondition?.final) return;

			modelValue.value.group = newGroup;
			modelValue.value.assignee = newAssignee;
		}
	},
	{
		deep: true,
	},
);

watch(
	() => modelValue.value.group,
	(newValue) => {
		const isDynamicGroup = newValue?.type === ContactsGroupType.Dynamic;

		if (isDynamicGroup) {
			resetAssignee();
			isAssignMeDisabled.value = true;
		} else {
			isAssignMeDisabled.value = false;
		}
	},
	{
		deep: true,
	},
);

const createRouteLinkParams = (name, id) => {
	return {
		name,
		params: {
			id,
		},
	};
};

const getContactLinkPreview = (id) => {
	if (!isReadOnly) {
		return createRouteLinkParams(`${CrmSections.Contacts}-card`, id);
	}

	return createRouteLinkParams(CONTACT_VIEW_NAME, ':etag');
};

/**
 * @author @Oleksandr Palonnyi
 *
 * [WTEL-6779] (https://webitel.atlassian.net/browse/WTEL-6779)
 *
 * This function opens a new tab with the contact link. This is made to handle read-only mode
 * in which we must pass etag instead of id, and etag we can get only from the API while clicking on link.
 * */
const getContactLink = async (id) => {
	let url: string;

	if (!isReadOnly) {
		url = router.resolve(
			createRouteLinkParams(`${CrmSections.Contacts}-card`, id),
		).href;
	} else {
		const { etag } = await ContactsAPI.get({
			itemId: id,
		});
		url = router.resolve(createRouteLinkParams(CONTACT_VIEW_NAME, etag)).href;
	}

	window.open(url, '_blank', 'noopener');
};

const getContactsLookup = async (params) => {
	return await ContactsAPI.getLookup({
		...params,
		qin: 'name,phones,emails',
	});
};
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-persons {
  width: 100%;

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
  }

  &__title {
    display: block;
    padding: var(--spacing-xs);
  }

  &__list-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    gap: var(--spacing-xs);
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__author {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__label {
    font-weight: bold;
  }

  &__select {
    padding: var(--spacing-xs) 0;
  }
}
</style>
