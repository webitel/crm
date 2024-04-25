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
    default: 'default',
  },
});
</script>

<style lang="scss" scoped>
.timeline-flow-line {
  height: var(--spacing-sm);
  width: 1px;
  position: relative;
  display: block;
  background-color: var(--btn-secondary-color);
  bottom: 0;
 //// left: 50%;
  transform: translate(50%, 0);

  &--success {
    background-color: var(--success-color);
  }

  &--primary {
    background-color: var(--primary-color);
  }

  &--error {
    background-color: var(--error-color);
  }
}
</style>
