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
        :label="t('lookups.serviceCatalogs.statuses')"
        :search-method="loadStatusesList"
        :model-value="itemInstance.status"
        :disabled="disableUserInput"
        :v="v.itemInstance.status"
        required
        @update:model-value="setItemProp({ path: 'status', value: $event })"
      />

      <wt-input-text
        :label="t('lookups.serviceCatalogs.prefix')"
        :model-value="itemInstance.prefix"
        :v="v.itemInstance.prefix"
        :disabled="disableUserInput"
        required
        @update:model-value="setItemProp({ path: 'prefix', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.closeReasonGroups.closeReasonGroups')"
        :search-method="loadReasonList"
        :model-value="itemInstance.closeReasonGroup"
        :v="v.itemInstance.closeReasonGroup"
        :disabled="disableUserInput"
        required
        @update:model-value="setItemProp({ path: 'closeReasonGroup', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :model-value="itemInstance.sla"
        :v="v.itemInstance.sla"
        :disabled="disableUserInput"
        required
        @update:model-value="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-single-select
        :label="t('lookups.serviceCatalogs.defaultPriority')"
        :search-method="loadPrioritiesList"
        :model-value="itemInstance.defaultPriority"
        :v="v.itemInstance.defaultPriority"
        :disabled="disableUserInput"
        required
        @update:model-value="setItemProp({ path: 'defaultPriority', value: $event })"
      />

      <wt-multi-select
        :label="t('objects.team', 2)"
        :search-method="loadTeamsList"
        :model-value="itemInstance.teams"
        :disabled="disableUserInput"
        @update:model-value="setItemProp({ path: 'teams', value: $event })"
      />

      <wt-input-text
        :label="t('lookups.serviceCatalogs.code')"
        :disabled="disableUserInput"
        :model-value="itemInstance.code"
        @update:model-value="setItemProp({ path: 'code', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
        :model-value="itemInstance.description"
        @update:model-value="setItemProp({ path: 'description', value: $event })"
      />

      <div class="opened-card-input-grid__skills-wrapper">
        <wt-multi-select
          :label="t('lookups.serviceCatalogs.skills')"
          :search-method="loadSkillsList"
          :model-value="itemInstance.skills"
          :disabled="disableUserInput"
          @update:model-value="setItemProp({ path: 'skills', value: $event })"
        />

        <wt-switcher
          :disabled="disableUserInput"
          :label="t('reusable.state')"
          :model-value="itemInstance.state"
          @update:model-value="setItemProp({ path: 'state', value: $event })"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import {
	CaseCloseReasonGroupsAPI,
	CasePrioritiesAPI,
	CaseStatusesAPI,
	SkillsAPI,
	SlasAPI,
	TeamsAPI,
} from '@webitel/api-services/api';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

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

const { disableUserInput } = useUserAccessControl();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadStatusesList(params) {
	return CaseStatusesAPI.getLookup(params);
}

function loadReasonList(params) {
	return CaseCloseReasonGroupsAPI.getLookup(params);
}

function loadSlaList(params) {
	return SlasAPI.getLookup(params);
}

function loadPrioritiesList(params) {
	return CasePrioritiesAPI.getLookup(params);
}

function loadTeamsList(params) {
	return TeamsAPI.getLookup(params);
}

function loadSkillsList(params) {
	return SkillsAPI.getLookup(params);
}
</script>

<style scoped>
.opened-card-input-grid__skills-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>