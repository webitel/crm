<template>
  <template v-if="field.kind === FieldType.Select">
    {{ displayText((value as { name?: string })?.name) }}
  </template>
  <wt-display-chip-items
    v-else-if="field.kind === FieldType.Multiselect"
    :items="(value as Array<{ id?: string; name?: string }>)"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="label"
    disabled
    :model-value="value"
  ></wt-switcher>
  <wt-datetime-text
    v-else-if="field.kind === FieldType.Calendar && value"
    :mode="FormatDateMode.DATETIME_SHORT"
    timezone="utc"
    :datetime="value"
  />
  <template v-else>
    {{ showText }}
  </template>
</template>

<script setup lang="ts">
import { WtDisplayChipItems } from '@webitel/ui-sdk/components';
import { FormatDateMode } from '@webitel/ui-sdk/enums';
import { displayText } from '@webitel/ui-sdk/utils';
import { computed } from 'vue';

import { FieldType } from '../../custom-lookups/enums/FieldType';
import type { DynamicFieldValue } from '../types/dynamicFieldValue';

const props = defineProps<{
	field: Record<string, any>;
	value: DynamicFieldValue;
	label?: string;
}>();

const showText = computed(() => displayText(props?.value as string | null));
</script>

<style lang="scss" scoped>
.display-dynamic-field__selected-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
