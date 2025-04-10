<template>
  <template v-if="field.kind === FieldType.Select">
    {{ displayText(value?.name) }}
  </template>
  <display-chip-items
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
import { computed } from 'vue';

import { displayText } from '../../../../../app/utils/displayText.js';
import DisplayChipItems
  from '../../../../configuration/modules/lookups/modules/service-catalogs/components/display-chip-items.vue';
import { FieldType } from '../../custom-lookups/enums/FieldType.enum.js';
import prettifyCustomLookupDate from '../../custom-lookups/utils/prettifyDate.js';

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
    required: true,
  },
});

const showText = computed(() => {
  if (!props.value) {
    return '';
  }

  const value = props.value;

  if (props.field.kind === FieldType.Calendar) {
    return displayText(prettifyCustomLookupDate(value));
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
