<template>
  <template v-if="field.kind === FieldType.SELECT">
    {{ displayText(value[field.value]?.name) }}
  </template>
  <display-chip-items
    v-else-if="field.kind === FieldType.MULTISELECT"
    :items="value[field.value]"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.BOOLEAN"
    :value="value[field.value]"
  ></wt-switcher>
  <template v-else-if="field.kind === FieldType.CALENDAR">
    {{ displayText(prettifyDate(value[field.value])) }}
  </template>
  <template v-else>
    {{ displayText(value[field.value]) }}
  </template>
</template>

<script setup>
import { displayText } from '../../../../../../../app/utils/displayText.js';
import prettifyDate from '../../../../../../cases/utils/prettifyDate.js';
import FieldType from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum.js';
import DisplayChipItems from '../../service-catalogs/components/display-chip-items.vue';

defineProps({
  field: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.display-dynamic-field__selected-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
