<template>
  <wt-button
    :color="ButtonColor.SECONDARY"
    :icon="icon"
    class="timeline-rounded-action"
    :class="[`timeline-rounded-action--${color}`]"
    @click="emit('click')"
  />
</template>

<script setup lang="ts">
import { ButtonColor } from '@webitel/ui-sdk/enums';

interface Props {
	icon: string;
	color?: 'primary' | 'success' | 'error' | 'chat' | 'secondary' | 'email';
}

withDefaults(defineProps<Props>(), {
	color: 'secondary',
});

const emit = defineEmits<{
	click: [];
}>();
</script>

<style lang="scss" scoped>
.timeline-rounded-action {
  &.wt-button {
    border-radius: 50%;
    border: 2px solid;
  }

  &--primary.wt-button {
    border-color: var(--primary-color);
    background-color: var(--primary-color);

    &:hover,
    &:active {
      border-color: var(--primary-hover-color);
      background-color: var(--primary-hover-color);
    }

    /* wt-icon sets its own fill via a color class (.wt-icon--color-default);
       !important guarantees this override wins regardless of stylesheet load order */
    :deep(.wt-icon) {
      fill: var(--icon-on-dark-color) !important;
    }
  }

  &--secondary.wt-button {
    border-color: var(--secondary-color);
    background-color: var(--secondary-color);

    &:hover,
    &:active {
      border-color: var(--secondary-hover-color);
      background-color: var(--secondary-hover-color);
    }
  }

  &--success.wt-button {
    border-color: var(--success-color);
    background-color: var(--success-color);

    &:hover,
    &:active {
      border-color: var(--success-hover-color);
      background-color: var(--success-hover-color);
    }

    /* wt-icon sets its own fill via a color class (.wt-icon--color-default);
       !important guarantees this override wins regardless of stylesheet load order */
    :deep(.wt-icon) {
      fill: var(--icon-on-dark-color) !important;
    }
  }

  &--error.wt-button {
    border-color: var(--error-color);
    background-color: var(--error-color);

    &:hover,
    &:active {
      border-color: var(--error-hover-color);
      background-color: var(--error-hover-color);
    }

    /* wt-icon sets its own fill via a color class (.wt-icon--color-default);
       !important guarantees this override wins regardless of stylesheet load order */
    :deep(.wt-icon) {
      fill: var(--icon-on-dark-color) !important;
    }
  }

  &--chat.wt-button {
    border-color: var(--chat-color);
    background-color: var(--chat-color);

    &:hover,
    &:active {
      border-color: var(--chat-hover-color);
      background-color: var(--chat-hover-color);
    }

    /* wt-icon sets its own fill via a color class (.wt-icon--color-default);
       !important guarantees this override wins regardless of stylesheet load order */
    :deep(.wt-icon) {
      fill: var(--icon-on-dark-color) !important;
    }
  }

  &--email.wt-button {
    border-color: var(--email-color);
    background-color: var(--email-color);

    &:hover,
    &:active {
      border-color: var(--email-hover-color);
      background-color: var(--email-hover-color);
    }

    /* wt-icon sets its own fill via a color class (.wt-icon--color-default);
       !important guarantees this override wins regardless of stylesheet load order */
    :deep(.wt-icon) {
      fill: var(--icon-on-dark-color) !important;
    }
  }
}
</style>
