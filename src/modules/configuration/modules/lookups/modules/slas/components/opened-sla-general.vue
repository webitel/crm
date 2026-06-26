<template>
  <section class="opened-sla-general">
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
        :label="t('objects.calendar')"
        :search-method="loadCalendarsList"
        v-model:model-value="modelValue.calendar"
        :regle-validation="validationFields?.calendar"
        :disabled="disableUserInput"
        required
      />

      <wt-textarea
        v-model="modelValue.description"
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
      />

      <div class="opened-card-input-grid opened-sla-general__wrapper">
        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          v-model:model-value="modelValue.reactionTime"
          :disabled="disableUserInput"
          :regle-validation="validationFields?.reactionTime"
          format="hh:mm"
          required
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          v-model:model-value="modelValue.resolutionTime"
          :disabled="disableUserInput"
          :regle-validation="validationFields?.resolutionTime"
          format="hh:mm"
          required
        />

        <wt-datepicker
          :label="t('lookups.slas.validFrom')"
          v-model="modelValue.validFrom"
          :disabled="disableUserInput"
          :regle-validation="validationFields?.validFrom"
          mode="datetime"
          clearable
        />

        <wt-datepicker
          :label="t('lookups.slas.validTo')"
          v-model="modelValue.validTo"
          :disabled="disableUserInput"
          mode="datetime"
          clearable
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CalendarsAPI } from '@webitel/api-services/api';
import type { WebitelCasesSLA } from '@webitel/api-services/gen/models';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<WebitelCasesSLA>();

defineProps<{
	validationFields?: CardValidationFields<WebitelCasesSLA>;
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();

function loadCalendarsList(search) {
	return CalendarsAPI.getLookup(search);
}
</script>

<style lang="scss" scoped>
.opened-sla-general {
  :deep(.wt-textarea__textarea) {
    min-height: 120px;
  }

  &__wrapper {
    grid-row-gap: 0;
  }
}
</style>
