<template>
  <section class="opened-sla-general">
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
        :label="t('lookups.slas.calendar')"
        :search-method="loadCalendarsList"
        :value="itemInstance.calendar"
        required
        @input="setItemProp({ prop: 'calendar', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />

      <div>
        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          :value="itemInstance.reactionTime"
          format='hh:mm'
          @input="setItemProp({ prop: 'reactionTime', value: +$event })"
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          :value="itemInstance.resolutionTime"
          format='hh:mm'
          @input="setItemProp({ prop: 'resolutionTime', value: +$event })"
        />
      </div>

      <div class="opened-sla-general__wrapper">
        <wt-datepicker
          :label="t('lookups.slas.validFrom')"
          :value="itemInstance.validFrom"
          mode="datetime"
          @input="setItemProp({ prop: 'validFrom', value: $event })"
        />

        <wt-datepicker
          :label="t('lookups.slas.validTo')"
          :value="itemInstance.validTo"
          mode="datetime"
          @input="setItemProp({ prop: 'validTo', value: $event })"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';
import CalendarsAPI from '@webitel/ui-sdk/src/api/clients/calendars/calendars.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadCalendarsList(search) {
  return CalendarsAPI.getLookup(search);
}
</script>

<style lang="scss" scoped>
.opened-sla-general__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
