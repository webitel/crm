<template>
  <template v-if="field.kind === FieldType.Select">
    {{ displayText(value[field.value]?.name) }}
  </template>
  <display-chip-items
    v-else-if="field.kind === FieldType.Multiselect"
    :items="value[field.value]"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :value="value[field.value]"
  ></wt-switcher>
  <template v-else>
    {{ showText }}
  </template>
</template>

<script setup>
import { computed } from 'vue';

import { displayText } from '../../../../../../../app/utils/displayText.js';
import { FieldType } from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum.js';
import prettifyCustomLookupDate from '../../../../../../customization/modules/custom-lookups/utils/prettifyDate.js';
import DisplayChipItems from '../../service-catalogs/components/display-chip-items.vue';

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
  const value = props.value[props.field.value];

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
