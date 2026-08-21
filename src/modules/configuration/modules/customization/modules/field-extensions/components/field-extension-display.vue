<template>
  <div class="field-extension-display">
    <span
      v-if="showLabel"
      class="field-extension-display__title case-section-title"
    >
      {{ label }}
    </span>

    <display-dynamic-field-extension
      v-if="value || field.kind === FieldType.Boolean"
      :value="value"
      :field="field"
      :label="label"
    />
    <span v-else> {{ EMPTY_SYMBOL }} </span>
  </div>
</template>

<script setup lang="ts">
import { EMPTY_SYMBOL } from '@webitel/ui-sdk/utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { FieldType } from '../../custom-lookups/enums/FieldType';
import DisplayDynamicFieldExtension from './display-dynamic-field-extension.vue';

const props = defineProps<{
	value: string;
	field: Record<string, any>;
}>();

const { t } = useI18n();

const showLabel = computed(() => {
	return props.field.kind !== FieldType.Boolean;
});

const label = computed(() => {
	return t(props.field?.name || 'vocabulary.labels');
});
</script>

<style
  scoped
  lang="scss"
>
@use '@webitel/ui-sdk/src/css/main' as *;

.field-extension-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

}
</style>
