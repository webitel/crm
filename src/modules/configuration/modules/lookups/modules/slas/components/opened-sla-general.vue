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
        :v="v.itemInstance.name"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('objects.calendar')"
        :search-method="loadCalendarsList"
        :value="itemInstance.calendar"
        :v="v.itemInstance.calendar"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'calendar', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />

      <div class="opened-card-input-grid opened-sla-general__wrapper">
        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          :value="itemInstance.reactionTime"
          :v="v.itemInstance.reactionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @input="setItemProp({ path: 'reactionTime', value: +$event })"
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          :value="itemInstance.resolutionTime"
          :v="v.itemInstance.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @input="setItemProp({ path: 'resolutionTime', value: +$event })"
        />

        <wt-datepicker
          :label="t('lookups.slas.validFrom')"
          :value="itemInstance.validFrom"
          :disabled="disableUserInput"
          mode="datetime"
          clearable
          @input="setItemProp({ path: 'validFrom', value: +$event })"
        />

        <wt-datepicker
          :label="t('lookups.slas.validTo')"
          :value="itemInstance.validTo"
          :disabled="disableUserInput"
          mode="datetime"
          clearable
          @input="setItemProp({ path: 'validTo', value: +$event })"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { CalendarsAPI } from '@webitel/api-services/api';
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

function loadCalendarsList(search) {
  return CalendarsAPI.getLookup(search);
}
</script>

<style lang="scss" scoped>
// TODO: temporary solution. Will be fixed with typography
.opened-sla-general {
  :deep(.wt-textarea__textarea) {
    min-height: 120px;
  }

  &__wrapper {
    grid-row-gap: 0;
  }
}
</style>
