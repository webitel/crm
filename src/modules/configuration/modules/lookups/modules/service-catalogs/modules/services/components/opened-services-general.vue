<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input-text
        :label="t('reusable.name')"
        :model-value="itemInstance.name"
        :v="v.itemInstance.name"
        :disabled="disableUserInput"
        required
        @update:model-value="setItemProp({ path: 'name', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.contactGroups.assignee')"
        :search-method="loadContact"
        :model-value="itemInstance.assignee"
        :disabled="
          disableUserInput || itemInstance.group?.type === ContactsGroupType.Dynamic
        "
        @update:model-value="setItemProp({ path: 'assignee', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :model-value="itemInstance.sla"
        :disabled="disableUserInput"
        :v="v.itemInstance.sla"
        @update:model-value="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.serviceCatalogs.defaultPriority')"
        :search-method="loadPrioritiesList"
        :model-value="itemInstance.defaultPriority"
        :v="v.itemInstance.defaultPriority"
        :disabled="disableUserInput"
        @update:model-value="setItemProp({ path: 'defaultPriority', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.contactGroups.contactGroups')"
        :search-method="loadContactGroupsList"
        :model-value="itemInstance.group"
        :disabled="disableUserInput"
        @update:model-value="setItemProp({ path: 'group', value: $event })"
      />

      <wt-input-text
        :label="t('lookups.serviceCatalogs.code')"
        :model-value="itemInstance.code"
        :disabled="disableUserInput"
        @update:model-value="setItemProp({ path: 'code', value: $event })"
      />

      <wt-switcher
        :label="t('reusable.state')"
        :disabled="disableUserInput"
        :model-value="itemInstance.state"
        @update:model-value="setItemProp({ path: 'state', value: $event })"
      />

      <wt-textarea
        :disabled="disableUserInput"
        :label="t('vocabulary.description')"
        :model-value="itemInstance.description"
        @update:model-value="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import {
	CasePrioritiesAPI,
	ContactGroupsAPI,
	ContactsAPI,
	SlasAPI,
} from '@webitel/api-services/api';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';

const props = defineProps({
	namespace: {
		type: String,
		required: true,
	},
	v: {
		type: Object,
		required: true,
	},
});

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const { itemInstance, setItemProp } = useCardStore(props.namespace);

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
