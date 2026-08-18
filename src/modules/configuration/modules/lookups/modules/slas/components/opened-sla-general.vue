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
        v-model:model-value="modelValue.calendar"
        :label="t('objects.calendar')"
        :search-method="hasCalendarsReadAccess && loadCalendarsList"
        :regle-validation="validationFields?.calendar"
        :disabled="disableUserInput || !hasCalendarsReadAccess"
        required
      />

      <wt-textarea
        v-model:model-value="modelValue.description"
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
          @update:model-value="modelValue.reactionTime = String($event)"
        />

        <wt-timepicker
          :model-value="modelValue.resolutionTime"
          :label="t('lookups.slas.resolutionTime')"
          :regle-validation="validationFields?.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="modelValue.resolutionTime = String($event)"
        />

        <wt-datepicker
          :label="t('lookups.slas.validFrom')"
          :model-value="modelValue.validFrom"
          :disabled="disableUserInput"
          :regle-validation="validationFields?.validFrom"
          show-time
          clearable
          @update:model-value="modelValue.validFrom = String($event)"
        />

        <wt-datepicker
          :label="t('lookups.slas.validTo')"
          :model-value="modelValue.validTo"
          :disabled="disableUserInput"
          :regle-validation="validationFields?.validTo"
          show-time
          clearable
          @update:model-value="onValidToChange"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { CalendarsAPI } from '@webitel/api-services/api';
import type { WebitelCasesSLA } from '@webitel/api-services/gen/models';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { WtObject } from '@webitel/ui-sdk/enums';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<WebitelCasesSLA>();

const props = defineProps<{
	validationFields?: CardValidationFields<WebitelCasesSLA>;
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();
const { hasReadAccess: hasCalendarsReadAccess } = useUserAccessControl(
	WtObject.Calendar,
);

function loadCalendarsList(search) {
	return CalendarsAPI.getLookup(search);
}

function onValidToChange(value?: number) {
	modelValue.value.validTo = String(value);
	props.validationFields?.validFrom?.$touch();
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
