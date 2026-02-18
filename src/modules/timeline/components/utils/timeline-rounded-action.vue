<template>
  <wt-rounded-action
    :color="iColor"
    :icon="icon"
    class="timeline-rounded-action"
    :class="[`timeline-rounded-action--${color}`]"
    rounded
    @click="emit('click')"
  />
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
		default: 'secondary',
		validator: (value) =>
			[
				'primary',
				'success',
				'error',
				'chat',
				'secondary',
				'email',
			].includes(value),
	},
});

const emit = defineEmits([
	'click',
]);

const iColor = computed(() =>
	props.color === 'secondary' ? 'default' : 'on-dark',
);
</script>

<style lang="scss" scoped>
.timeline-rounded-action {
  &--primary.wt-rounded-action {
    border-color: var(--primary-color);
    background-color: var(--primary-color);

    &:hover,
    &:active {
      border-color: var(--primary-hover-color);
      background-color: var(--primary-hover-color);
    }
  }

  &--secondary.wt-rounded-action {
    border-color: var(--secondary-color);
    background-color: var(--secondary-color);

    &:hover,
    &:active {
      border-color: var(--secondary-hover-color);
      background-color: var(--secondary-hover-color);
    }
  }

  &--success.wt-rounded-action {
    border-color: var(--success-color);
    background-color: var(--success-color);

    &:hover,
    &:active {
      border-color: var(--success-hover-color);
      background-color: var(--success-hover-color);
    }
  }

  &--error.wt-rounded-action {
    border-color: var(--error-color);
    background-color: var(--error-color);

    &:hover,
    &:active {
      border-color: var(--error-hover-color);
      background-color: var(--error-hover-color);
    }
  }

  &--chat.wt-rounded-action {
    border-color: var(--chat-color);
    background-color: var(--chat-color);

    &:hover,
    &:active {
      border-color: var(--chat-hover-color);
      background-color: var(--chat-hover-color);
    }
  }

  &--email.wt-rounded-action {
    border-color: var(--email-color);
    background-color: var(--email-color);

    &:hover,
    &:active {
      border-color: var(--email-hover-color);
      background-color: var(--email-hover-color);
    }
  }
}
</style>
