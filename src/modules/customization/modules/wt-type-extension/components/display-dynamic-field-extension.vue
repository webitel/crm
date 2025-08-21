<template>
  <template v-if="field.kind === FieldType.Select">
    {{ displayText(value?.name) }}
  </template>
  <wt-display-chip-items
    v-else-if="field.kind === FieldType.Multiselect"
    :items="value"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="label"
    disabled
    :value="value"
  ></wt-switcher>
  <template v-else-if="field.kind === FieldType.Number">
    {{ value }}
  </template>
  <template v-else>
    {{ showText }}
  </template>
</template>

<script setup>
import { WtDisplayChipItems } from '@webitel/ui-sdk/components';
import { displayText } from '@webitel/ui-sdk/utils';
import { computed } from 'vue';

import prettifyDate from '../../../../cases/utils/prettifyDate.js';
import { FieldType } from '../../custom-lookups/enums/FieldType.enum.js';

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});

const showText = computed(() => {
  if (!props.value) {
    return '';
  }

  const value = props.value;

  if (props.field.kind === FieldType.Calendar) {
    return displayText(prettifyDate(value));
  }

  return displayText(value);
});
</script>

<style lang="scss" scoped>
.display-dynamic-field__selected-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
