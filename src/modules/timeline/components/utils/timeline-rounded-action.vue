<template>
  <wt-button
    :color="ButtonColor.SECONDARY"
    :icon="icon"
    :icon-color="iconColor"
    class="timeline-rounded-action"
    :style="{
      '--timeline-rounded-action-color': `var(--${color}-color)`,
      '--timeline-rounded-action-hover-color': `var(--${color}-hover-color)`,
    }"
    @click="emit('click')"
  />
</template>

<script setup lang="ts">
import { ButtonColor, IconColor } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';

interface Props {
	icon: string;
	color?: 'primary' | 'success' | 'error' | 'chat' | 'secondary' | 'email';
}

const props = withDefaults(defineProps<Props>(), {
	color: 'secondary',
});

const iconColor = computed(() =>
	props.color === 'secondary' ? undefined : IconColor.ON_DARK,
);

const emit = defineEmits<{
	click: [];
}>();
</script>

<style lang="scss" scoped>
.timeline-rounded-action {
  &.wt-button {
    border-radius: 50%;
    border: 2px solid;
    border-color: var(--timeline-rounded-action-color);
    background-color: var(--timeline-rounded-action-color);

    &:hover,
    &:active {
      border-color: var(--timeline-rounded-action-hover-color);
      background-color: var(--timeline-rounded-action-hover-color);
    }
  }
}
</style>
