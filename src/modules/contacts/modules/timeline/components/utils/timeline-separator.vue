<template>
  <div
    :class="`timeline-separator--${color}`"
    class="timeline-separator"></div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'default',
  },
});
</script>

<style lang="scss" scoped>
.timeline-separator {
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
