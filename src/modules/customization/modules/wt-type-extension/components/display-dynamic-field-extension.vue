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
    :model-value="value"
  ></wt-switcher>
  <wt-datetime-text
    v-else-if="field.kind === FieldType.Calendar && value"
    mode="datetimeShort"
    timezone="utc"
    :datetime="value"
  />
  <template v-else>
    {{ showText }}
  </template>
</template>

<script setup>
import { WtDisplayChipItems } from '@webitel/ui-sdk/components';
import { displayText } from '@webitel/ui-sdk/utils';
import { computed } from 'vue';

import { FieldType } from '../../custom-lookups/enums/FieldType';

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

const showText = computed(() => displayText(props?.value));
</script>

<style lang="scss" scoped>
.display-dynamic-field__selected-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
