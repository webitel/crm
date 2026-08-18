<template>
  <section>
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
        v-model:model-value="modelValue.description"
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { WebitelCasesCloseReasonGroup } from '@webitel/api-services/gen/models';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<WebitelCasesCloseReasonGroup>();

defineProps<{
	validationFields: CardValidationFields<WebitelCasesCloseReasonGroup>;
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();
</script>

<style lang="scss" scoped>
</style>
