<template>
  <section class="opened-status-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>

    <div class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50">
      <wt-input-text
        v-model:model-value="modelValue.name"
        :label="t('reusable.name')"
        :regle-validation="validationFields?.name"
        :disabled="disableUserInput"
        required
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
        :model-value="modelValue.description"
        @update:model-value="modelValue.description = $event"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { WebitelCasesStatus } from '@webitel/api-services/gen/models';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import type { CardValidationFields } from '@webitel/ui-datalist/card';

const modelValue = defineModel<WebitelCasesStatus>();

defineProps<{
	validationFields: CardValidationFields<WebitelCasesStatus>;
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();
</script>

<style lang="scss" scoped>
// TODO: temporary solution. Will be fixed with typography
.opened-status-general {
  :deep(.wt-textarea__textarea) {
    min-height: 120px;
  }

  &__wrapper {
    grid-row-gap: 0;
  }
}
</style>
