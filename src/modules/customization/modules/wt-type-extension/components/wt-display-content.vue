<template>
  <div class="wt-display-content">
    <span
      v-if="showLabel"
      class="wt-display-content__title"
    >
      {{ label }}
    </span>

    <display-dynamic-field-extension
      v-if="value"
      :value="value"
      :field="field"
      :label="label"
    />
    <span v-else> {{ EMPTY_SYMBOL }} </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { EMPTY_SYMBOL } from '../../../../../app/utils/displayText.js';
import { FieldType } from '../../custom-lookups/enums/FieldType.enum.js';
import DisplayDynamicFieldExtension from './display-dynamic-field-extension.vue';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  field: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const showLabel = computed(() => {
  return props.field.kind !== FieldType.Boolean;
});

const label = computed(() => {
  return t(props.field?.name || 'vocabulary.labels');
});
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.wt-display-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  &__title {
    @extend %typo-heading-4;
  }
}
</style>
