<template>
  <wt-item-link
    v-if="field.value === 'name'"
    :link="{ name: 'custom-lookup-record', params: { id: value.id } }"
  >
    {{ showText }}
  </wt-item-link>
  <template v-else-if="field.kind === FieldType.Select">
    {{ displayText(value[field.value]?.name) }}
  </template>
  <wt-display-chip-items
    v-else-if="field.kind === FieldType.Multiselect"
    :items="value[field.value]"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    disabled
    :model-value="value[field.value]"
  ></wt-switcher>
  <template v-else>
    {{ showText }}
  </template>
</template>

<script setup>
import { WtDisplayChipItems } from '@webitel/ui-sdk/components';
import { displayText } from '@webitel/ui-sdk/utils';
import { computed } from 'vue';

import prettifyDate from '../../../../../../cases/utils/prettifyDate.js';
import {
  FieldType,
} from '../../../../../../customization/modules/custom-lookups/enums/FieldType.js';

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});

const showText = computed(() => {
  if (!props.value) {
    return '';
  }

  const value = props.value[props.field.value];

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
