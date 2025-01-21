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
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.statuses')"
        :search-method="loadStatusesList"
        :value="itemInstance.status"
        :v="v.itemInstance.status"
        required
        :clearable="false"
        @input="setItemProp({ path: 'status', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.prefix')"
        :value="itemInstance.prefix"
        :v="v.itemInstance.prefix"
        required
        @input="setItemProp({ path: 'prefix', value: $event })"
      />

      <wt-select
        :label="t('lookups.closeReasonGroups.closeReasonGroups')"
        :search-method="loadReasonList"
        :value="itemInstance.closeReasonGroup"
        :v="v.itemInstance.closeReasonGroup"
        required
        :clearable="false"
        @input="setItemProp({ path: 'closeReasonGroup', value: $event })"
      />

      <wt-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :value="itemInstance.sla"
        :v="v.itemInstance.sla"
        required
        :clearable="false"
        @input="setItemProp({ path: 'sla', value: $event })"
      />
      <wt-select
        :label="t('objects.team', 2)"
        :search-method="loadTeamsList"
        :value="itemInstance.teams"
        multiple
        @input="setItemProp({ path: 'teams', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.code')"
        :value="itemInstance.code"
        @input="setItemProp({ path: 'code', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.skills')"
        :search-method="loadSkillsList"
        :value="itemInstance.skills"
        multiple
        @input="setItemProp({ path: 'skills', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />

      <wt-switcher
        v-if="!isNew"
        :label="t('reusable.state')"
        :value="itemInstance.state"
        @change="setItemProp({ path: 'state', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import SkillsAPI from '@webitel/ui-sdk/src/api/clients/skills/skills.js';
import TeamsAPI from '@webitel/ui-sdk/src/api/clients/teams/teams.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import CloseReasonGroupsAPI from '../../close-reason-groups/api/closeReasonGroups.js';
import SlasAPI from '../../slas/api/slas.js';
import StatusesApi from '../../statuses/api/statuses.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadStatusesList(params) {
  return StatusesApi.getLookup(params);
}

function loadReasonList(params) {
  return CloseReasonGroupsAPI.getLookup(params);
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
