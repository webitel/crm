<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        :v="v.itemInstance.name"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.statuses')"
        :search-method="loadStatusesList"
        :value="itemInstance.status"
        :disabled="disableUserInput"
        :v="v.itemInstance.status"
        required
        @input="setItemProp({ path: 'status', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.prefix')"
        :value="itemInstance.prefix"
        :v="v.itemInstance.prefix"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'prefix', value: $event })"
      />

      <wt-select
        :label="t('lookups.closeReasonGroups.closeReasonGroups')"
        :search-method="loadReasonList"
        :value="itemInstance.closeReasonGroup"
        :v="v.itemInstance.closeReasonGroup"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'closeReasonGroup', value: $event })"
      />

      <wt-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :value="itemInstance.sla"
        :v="v.itemInstance.sla"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'sla', value: $event })"
      />
      <wt-select
        :label="t('objects.team', 2)"
        :search-method="loadTeamsList"
        :value="itemInstance.teams"
        :disabled="disableUserInput"
        multiple
        @input="setItemProp({ path: 'teams', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.code')"
        :disabled="disableUserInput"
        :value="itemInstance.code"
        @input="setItemProp({ path: 'code', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.skills')"
        :search-method="loadSkillsList"
        :value="itemInstance.skills"
        :disabled="disableUserInput"
        multiple
        @input="setItemProp({ path: 'skills', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />

      <wt-switcher
        :disabled="disableUserInput"
        :label="t('reusable.state')"
        :model-value="itemInstance.state"
        @update:model-value="setItemProp({ path: 'state', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { CaseCloseReasonGroupsAPI,CaseStatusesAPI, SkillsAPI, SlasAPI, TeamsAPI } from '@webitel/api-services/api';
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

function loadTeamsList(params) {
  return TeamsAPI.getLookup(params);
}

function loadSkillsList(params) {
  return SkillsAPI.getLookup(params);
}
</script>
