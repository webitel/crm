<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input-text
        v-model:model-value="modelValue.name"
        :label="t('reusable.name')"
        :regle-validation="validationFields?.name"
        :disabled="disableUserInput"
        required
      />

      <wt-single-select
        v-model:model-value="modelValue.assignee"
        :label="t('lookups.contactGroups.assignee')"
        :search-method="hasContactsReadAccess && loadContact"
        :disabled="disableAssigneeInput"
      />

      <wt-single-select
        v-model:model-value="modelValue.sla"
        :label="t('lookups.slas.slas')"
        :search-method="hasSlasReadAccess && loadSlaList"
        :regle-validation="validationFields?.sla"
        :disabled="disableUserInput || !hasSlasReadAccess"
      />

      <wt-single-select
        v-model:model-value="modelValue.defaultPriority"
        :label="t('lookups.serviceCatalogs.defaultPriority')"
        :search-method="hasPrioritiesReadAccess && loadPrioritiesList"
        :regle-validation="validationFields?.defaultPriority"
        :disabled="disableUserInput || !hasPrioritiesReadAccess"
      />

      <wt-single-select
        v-model:model-value="modelValue.group"
        :label="t('lookups.contactGroups.contactGroups')"
        :search-method="hasContactGroupsReadAccess && loadContactGroupsList"
        :disabled="disableUserInput || !hasContactGroupsReadAccess"
      />

      <wt-input-text
        v-model:model-value="modelValue.code"
        :label="t('lookups.serviceCatalogs.code')"
        :disabled="disableUserInput"
      />

      <wt-switcher
        v-model:model-value="modelValue.state"
        :label="t('reusable.state')"
        :disabled="disableUserInput"
      />

      <wt-textarea
        v-model:model-value="modelValue.description"
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
	CasePrioritiesAPI,
	ContactGroupsAPI,
	ContactsAPI,
	SlasAPI,
} from '@webitel/api-services/api';
import type { WebitelCasesService } from '@webitel/api-services/gen/models';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { WtObject } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<WebitelCasesService>();

defineProps<{
	validationFields: CardValidationFields<WebitelCasesService>;
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});
const { hasReadAccess: hasContactsReadAccess } = useUserAccessControl(
	WtObject.Contact,
);
const { hasReadAccess: hasSlasReadAccess } = useUserAccessControl(
	WtObject.Slas,
);
const { hasReadAccess: hasPrioritiesReadAccess } = useUserAccessControl(
	WtObject.Priorities,
);
const { hasReadAccess: hasContactGroupsReadAccess } = useUserAccessControl(
	WtObject.ContactGroup,
);

const disableAssigneeInput = computed(
	() =>
		disableUserInput.value ||
		!hasContactsReadAccess.value ||
		modelValue.value.group?.type === ContactsGroupType.Dynamic,
);

const loadSlaList = (params) => {
	return SlasAPI.getLookup(params);
};

const loadPrioritiesList = (params) => {
	return CasePrioritiesAPI.getLookup(params);
};

const loadContactGroupsList = (params) => {
	return ContactGroupsAPI.getLookup({
		...params,
		fields: [
			'id',
			'name',
			'type',
		],
	});
};

const loadContact = (params) => {
	return ContactsAPI.getLookup(params);
};
</script>
