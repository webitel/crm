<template>
  <div
    class="case-priority-color-component"
    :class="{ 'case-priority-color-component--colored': color }"
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
:root {
  --case-priority-color-default: var(--grey-darken-2);
  --case-priority-color-red: var(--red-darken-2);
  --case-priority-color-pink: var(--pink-darken-2);
  --case-priority-color-purple: var(--purple-darken-2);
  --case-priority-color-deep-purple: var(--deep-purple-darken-2);
  --case-priority-color-indigo: var(--indigo-darken-2);
  --case-priority-color-blue: var(--blue-darken-2);
  --case-priority-color-light-blue: var(--light-blue-darken-2);
  --case-priority-color-cyan: var(--cyan-darken-2);
  --case-priority-color-teal: var(--teal-darken-2);
  --case-priority-color-green: var(--green-darken-2);
  --case-priority-color-light-green: var(--light-green-darken-2);
  --case-priority-color-lime: var(--lime-darken-2);
  --case-priority-color-yellow: var(--yellow-darken-2);
  --case-priority-color-amber: var(--amber-darken-2);
  --case-priority-color-orange: var(--orange-darken-2);
  --case-priority-color-deep-orange: var(--deep-orange-darken-2);
}
</style>

<style scoped lang="scss">
.case-priority-color-component--colored {
  color: v-bind(colorVariable);

  :deep(.wt-indicator__indicator) {
    background: v-bind(colorVariable);
  }

  .wt-icon {
      fill: v-bind(colorVariable);
  }
}
</style>
