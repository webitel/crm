<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('customization.customLookups.columns') }}
      </h3>
    </header>
    <div
      class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50"
    >
      <custom-lookup-dynamic-field
        v-for="field in fields"
        :key="field.id"
        :field="field"
        :item-instance="modelValue"
        :regle-validation="validationFields?.[field.id]"
        :disabled="disableUserInput"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { DataField } from '@webitel/api-services/gen/models';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { FieldType } from '../../../../customization/modules/custom-lookups/enums/FieldType';
import { customLookupFields } from '../stores/_internals/customLookupFields';
import CustomLookupDynamicField from './custom-lookup-dynamic-field.vue';

defineProps<{
	modelValue: Record<string, any>;
	validationFields?: Record<string, any>;
}>();

const { disableUserInput } = useUserAccessControl();

const { t } = useI18n();

const fields = computed<DataField[]>(() =>
	customLookupFields.value.filter(
		(field) =>
			!field.hidden &&
			(!field.readonly || field.kind === FieldType.Boolean) &&
			!field.always,
	),
);
</script>
