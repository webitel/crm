<template>
  <div
    class="timeline-rounded-action"
    :class="`timeline-rounded-action--${color}`"
  >
    <wt-rounded-action
      :icon="icon"
      :color="iColor"
      rounded
    >
    </wt-rounded-action>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    options: ['primary', 'success', 'error', 'chat', 'secondary'],
    default: 'secondary',
  },
});

const iColor = computed(() => (props.color === 'secondary') ? 'default' : 'on-dark');
</script>

<style lang="scss" scoped>
.timeline-rounded-action {
  &--primary:deep(.wt-rounded-action) {
    border-color: var(--primary-color);
    background-color: var(--primary-color);

    &:hover,
    &:active {
      border-color: var(--primary-hover-color);
      background-color: var(--primary-hover-color);
    }
  }

  &--secondary:deep(.wt-rounded-action) {
    border-color: var(--secondary-color);
    background-color: var(--secondary-color);

    &:hover,
    &:active {
      border-color: var(--secondary-hover-color);
      background-color: var(--secondary-hover-color);
    }
  }

  &--success:deep(.wt-rounded-action) {
    border-color: var(--success-color);
    background-color: var(--success-color);

    &:hover,
    &:active {
      border-color: var(--success-hover-color);
      background-color: var(--success-hover-color);
    }
  }

  &--error:deep(.wt-rounded-action) {
    border-color: var(--error-color);
    background-color: var(--error-color);

    &:hover,
    &:active {
      border-color: var(--error-hover-color);
      background-color: var(--error-hover-color);
    }
  }

  &--chat:deep(.wt-rounded-action) {
    border-color: var(--chat-color);
    background-color: var(--chat-color);

    &:hover,
    &:active {
      border-color: var(--chat-hover-color);
      background-color: var(--chat-hover-color);
    }
  }
}
</style>
