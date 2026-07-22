<template>
  <wt-popup
    :shown="!!conditionId"
    class="opened-contact-group-conditions-popup"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{
        !isNew
          ? t('lookups.slas.editCondition')
          : t('lookups.slas.addCondition')
      }}
    </template>

    <template #main>
      <form
        class="opened-contact-group-conditions-popup__wrapper"
        @submit.prevent="save"
      >
        <wt-input-text
          v-model:model-value="modelValue.expression"
          :label="t('lookups.slas.conditions', 1)"
          :regle-validation="validationFields?.expression"
          required
        />

        <wt-single-select
          :model-value="modelValue.group"
          :regle-validation="validationFields?.group"
          :label="t('lookups.contactGroups.contactGroups', 1)"
          :search-method="loadStaticContactGroupsList"
          required
          @update:model-value="handleGroupChange"
        />

        <wt-single-select
          :key="modelValue.group?.id"
          v-model:model-value="modelValue.assignee"
          :disabled="!modelValue?.group?.id"
          :label="t('lookups.contactGroups.assignee')"
          :search-method="loadContacts"
        />
      </form>
    </template>

    <template #actions>
      <wt-button
        :disabled="hasValidationErrors"
        @click="save"
      >
        {{ t('reusable.save') }}
      </wt-button>

      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script lang="ts" setup>
import { ContactGroupsAPI, ContactsAPI } from '@webitel/api-services/api';
import type { ContactsDynamicCondition } from '@webitel/api-services/gen/models';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { useNestedCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { WtSingleSelect } from '@webitel/ui-sdk/components';

import { useErrorRedirectHandler } from '../../../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useContactGroupConditionsCardStore } from '../stores';

const emit = defineEmits([
	'load-data',
]);

const route = useRoute();
const { t } = useI18n();
const { handleError } = useErrorRedirectHandler();

const {
	modelValue,
	validationFields,
	isNew,
	hasValidationErrors,
	save: saveItem,
} = useNestedCardComponent<ContactsDynamicCondition>({
	useCardStore: useContactGroupConditionsCardStore,
	routeParamName: 'conditionId',
	parentId: route.params.id as string,
	onLoadErrorHandler: handleError,
});

const conditionId = computed(() => route.params.conditionId);
const { close } = useClose(`${CrmSections.ContactGroups}-conditions`);

watch(
	conditionId,
	(value) => {
		if (value !== 'new') return;

		modelValue.value.expression = '';
		modelValue.value.group = null;
		modelValue.value.assignee = null;
	},
	{
		immediate: true,
	},
);

async function loadStaticContactGroupsList(params: Record<string, unknown>) {
	return ContactGroupsAPI.getLookup({
		...params,
		type: ContactsGroupType.Static,
		enabled: true,
	});
}

async function loadContacts(params: Record<string, unknown>) {
	return ContactsAPI.getLookup({
		...params,
		group: modelValue.value?.group?.id,
	});
}

async function handleGroupChange(value: ContactsDynamicCondition['group']) {
	modelValue.value.group = value;
	modelValue.value.assignee = null;
}

const save = async () => {
	await saveItem();
	close();
	emit('load-data');
};
</script>

<style lang="scss" scoped>
.opened-contact-group-conditions-popup__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
