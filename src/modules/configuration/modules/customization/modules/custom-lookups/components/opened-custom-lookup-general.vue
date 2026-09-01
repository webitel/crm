<template>
  <section class="opened-custom-lookup-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div
      class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50"
    >
      <wt-input-text
        :label="t('reusable.name')"
        :model-value="modelValue.name"
        :regle-validation="validationFields?.name"
        :disabled="disableUserInput"
        required
        @update:model-value="modelValue.name = $event"
      />
      <wt-input-text
        :label="t('customization.customLookups.code')"
        :model-value="modelValue.repo"
        :regle-validation="validationFields?.repo"
        :disabled="!isNew || disableUserInput"
        required
        @update:model-value="modelValue.repo = $event"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :model-value="modelValue.about"
        :disabled="disableUserInput"
        @update:model-value="modelValue.about = $event"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { RegleSchemaFieldStatus } from '@regle/schemas';
import type { DataInputDictionary } from '@webitel/api-services/gen/models';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

defineProps<{
	modelValue: DataInputDictionary;
	validationFields: {
		[K in keyof DataInputDictionary]: RegleSchemaFieldStatus<
			DataInputDictionary[K]
		>;
	};
	isNew: boolean;
}>();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();
</script>
