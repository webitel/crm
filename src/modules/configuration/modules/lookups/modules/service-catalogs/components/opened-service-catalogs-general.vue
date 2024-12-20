<template>
  <section class="opened-service-catalog-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.statuses')"
        :search-method="loadStatusesList"
        :value="itemInstance.status"
        required
        @input="setItemProp({ path: 'status', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.prefix')"
        :value="itemInstance.prefix"
        required
        @input="setItemProp({ path: 'prefix', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.closureReasons')"
        :search-method="loadReasonList"
        :value="itemInstance.closeReason"
        @input="setItemProp({ path: 'closeReason', value: $event })"
      />

      <wt-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :value="itemInstance.sla"
        required
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
        :label="t('reusable.state')"
        :value="itemInstance.state"
        @change="setItemProp({ path: 'state', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import SlasAPI from '../../slas/api/slas.js';
import TeamsAPI from '@webitel/ui-sdk/src/api/clients/teams/teams.js';
import CloseReasonsApi from '../../сlosure-reasons/api/closure-reasons.js';
import StatusesApi from '../../statuses/api/statuses.js';
import SkillsAPI from '@webitel/ui-sdk/src/api/clients/skills/skills.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadStatusesList(search) {
  return StatusesApi.getLookup(search);
}

function loadReasonList(search) {
  return CloseReasonsApi.getLookup(search);
}

function loadSlaList(search) {
  return SlasAPI.getLookup(search);
}

function loadTeamsList(search) {
  return TeamsAPI.getLookup(search);
}

function loadSkillsList(search) {
  return SkillsAPI.getLookup(search);
}
</script>

<style lang="scss" scoped>
.opened-sla-general__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
