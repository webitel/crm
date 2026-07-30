<template>
  <section class="opened-service-catalogs-general">
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
        v-model:model-value="modelValue.status"
        :label="t('lookups.serviceCatalogs.statuses')"
        :search-method="loadStatusesList"
        :regle-validation="validationFields?.status"
        :disabled="disableUserInput"
        required
      />

      <wt-input-text
        v-model:model-value="modelValue.prefix"
        :label="t('lookups.serviceCatalogs.prefix')"
        :regle-validation="validationFields?.prefix"
        :disabled="disableUserInput"
        required
      />

      <wt-single-select
        v-model:model-value="modelValue.closeReasonGroup"
        :label="t('lookups.closeReasonGroups.closeReasonGroups')"
        :search-method="loadReasonList"
        :regle-validation="validationFields?.closeReasonGroup"
        :disabled="disableUserInput"
        required
      />

      <wt-single-select
        v-model:model-value="modelValue.sla"
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :regle-validation="validationFields?.sla"
        :disabled="disableUserInput"
        required
      />

      <wt-single-select
        v-model:model-value="modelValue.defaultPriority"
        :label="t('lookups.serviceCatalogs.defaultPriority')"
        :search-method="loadPrioritiesList"
        :regle-validation="validationFields?.defaultPriority"
        :disabled="disableUserInput"
        required
      />

      <wt-multi-select
        v-model:model-value="modelValue.teams"
        :label="t('objects.team', 2)"
        :search-method="loadTeamsList"
        :disabled="disableUserInput"
      />

      <wt-input-text
        v-model:model-value="modelValue.code"
        :label="t('lookups.serviceCatalogs.code')"
        :disabled="disableUserInput"
      />

      <wt-textarea
        v-model:model-value="modelValue.description"
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
      />

      <div class="opened-card-input-grid__skills-wrapper">
        <wt-multi-select
          v-model:model-value="modelValue.skills"
          :label="t('lookups.serviceCatalogs.skills')"
          :search-method="loadSkillsList"
          :disabled="disableUserInput"
        />

        <wt-switcher
          v-model:model-value="modelValue.state"
          :label="t('reusable.state')"
          :disabled="disableUserInput"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
	CaseCloseReasonGroupsAPI,
	CasePrioritiesAPI,
	CaseStatusesAPI,
	SkillsAPI,
	SlasAPI,
	TeamsAPI,
} from '@webitel/api-services/api';
import type { WebitelCasesCatalog } from '@webitel/api-services/gen/models';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<WebitelCasesCatalog>();

defineProps<{
	validationFields: CardValidationFields<WebitelCasesCatalog>;
}>();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();

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
