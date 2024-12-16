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
        :value="itemInstance.reasons"
        @input="setItemProp({ path: 'reasons', value: $event })"
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
        :value="itemInstance.team"
        @input="setItemProp({ path: 'team', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.code')"
        :value="itemInstance.code"
        @input="setItemProp({ path: 'code', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.skills')"
        :search-method="loadSkillsList"
        :value="itemInstance.skill"
        @input="setItemProp({ path: 'skill', value: $event })"
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
import CalendarsAPI from '@webitel/ui-sdk/src/api/clients/calendars/calendars.js';
import SkillApi from '../../ priorities/api/priorities.js';
import SlasAPI from '../../slas/api/slas.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

// TODO Implement api to load statuses
function loadStatusesList(search) {
  return CalendarsAPI.getLookup(search);
}

// TODO Implement api to load reasons
function loadReasonList(search) {
  return CalendarsAPI.getLookup(search);
}

function loadSlaList(search) {
  return SlasAPI.getList(search);
}

// TODO Implement api to load teams
function loadTeamsList(search) {
  return CalendarsAPI.getLookup(search);
}

// TODO Implement api to load skills
function loadSkillsList(search) {
  return CalendarsAPI.getLookup(search);
}
</script>

<style lang="scss" scoped>
.opened-sla-general__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
