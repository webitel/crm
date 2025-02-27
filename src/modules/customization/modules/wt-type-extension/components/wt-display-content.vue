<template>
  <div class="wt-display-content">
    <span
      v-if="showLabel"
      class="wt-display-content__title"
    >
      {{ label }}
    </span>

    <display-dynamic-field
      v-if="value"
      :value="value"
      :field="field"
    />
    <span v-else> - </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DisplayDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/display-dynamic-field.vue';
import { FieldType } from '../../custom-lookups/enums/FieldType.enum.js';

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
.wt-display-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  &__title {
    @extend %typo-heading-4;
  }
}
</style>
