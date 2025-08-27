<template>
  <div
    class="case-priority-color-component"
    :class="[`case-priority-color-component-${color}`]"
  >
    <slot>
      <component
        v-bind="attrs"
        :is="component"
      />
    </slot>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const props = defineProps({
  /**
   * Component type to render. For example, 'wt-icon' or 'wt-indicator'.
   */
  component: {
    type: String,
    required: true,
    default: 'wt-indicator',
  },
  /**
   * @values 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange',
   */
  color: {
    type: String,
    default: 'red',
  },
});

const attrs = useAttrs();

const colorVariable = computed(
  () => `var(--case-priority-color-${props.color})`,
);
</script>

<style lang="scss">
@use '../../css/variables/case-priority-colors';
</style>

<style scoped lang="scss">
.case-priority-color-component {
  color: v-bind(colorVariable);

  :deep(.wt-indicator__indicator) {
    background: v-bind(colorVariable);
  }

  .wt-icon {
      fill: v-bind(colorVariable);
  }
}
</style>
