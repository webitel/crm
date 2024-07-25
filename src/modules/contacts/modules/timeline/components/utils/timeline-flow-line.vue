<template>
  <div
    :class="`timeline-flow-line--${color}`"
    class="timeline-flow-line"
  />
</template>

<script setup>
// TODO HELP ME!
const props = defineProps({
  color: {
    type: String,
    validator: (v) => [
      'default', // divider color
      'success',
      'primary',
      'error',
      'secondary',
      'chat',
      'transfer',
      'email',
    ].includes(v),
  },
});
</script>

<style lang="scss" scoped>
$mail-color: var(--blue-darken-1);

.timeline-flow-line {
  width: 1px;

  &--default {
    background-color: var(--divider-border-color);
  }

  &--secondary {
    background-color: var(--secondary-color);
  }

  &--chat {
    background-color: var(--chat-color);
  }

  &--transfer {
    background-color: var(--transfer-color);
  }

  &--success {
    background-color: var(--success-color);
  }

  &--primary {
    background-color: var(--primary-color);
  }

  &--error {
    background-color: var(--error-color);
  }

  &--email {
    background-color: $mail-color;
  }
}
</style>
