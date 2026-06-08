<template>
  <section class="opened-sla-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input-text
        v-model="modelValue.name"
        :label="t('reusable.name')"
        :regle-validation="validationFields?.name"
        :disabled="disableUserInput"
        required
      />

      <wt-single-select
        v-model="modelValue.calendar"
        :label="t('objects.calendar')"
        :search-method="loadCalendarsList"
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
          :model-value="modelValue.reactionTime"
          :label="t('lookups.slas.reactionTime')"
          :regle-validation="validationFields?.reactionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="modelValue.reactionTime = +$event"
        />

        <wt-timepicker
          :model-value="modelValue.resolutionTime"
          :label="t('lookups.slas.resolutionTime')"
          :regle-validation="validationFields?.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="modelValue.resolutionTime = +$event"
        />

        <wt-datepicker
          :label="t('lookups.slas.validFrom')"
          :value="modelValue.validFrom"
          :disabled="disableUserInput"
          :custom-validators="customValidation"
          mode="datetime"
          clearable
          @input="modelValue.validFrom = +$event || null"
        />

        <wt-datepicker
          :label="t('lookups.slas.validTo')"
          :value="modelValue.validTo"
          :disabled="disableUserInput"
          mode="datetime"
          clearable
          @input="modelValue.validTo = +$event || null"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { CalendarsAPI } from '@webitel/api-services/api';
import { WebitelCasesSLA } from '@webitel/api-services/gen';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { computed } from 'vue';
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

const customValidation = computed(() => {
	if (!modelValue.value?.validTo) return [];

	return [
		{
			name: 'maxValue',
			text: t('validation.maxValue', {
				max: new Date(modelValue.value.validTo).toLocaleString(),
			}),
		},
	];
});
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
