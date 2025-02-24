<template>
  <transition name="timeline-row-dropdown-transition">
    <slot />
  </transition>
</template>

<script setup>

</script>

<style lang="scss">
.timeline-row-dropdown-transition-enter-active,
.timeline-row-dropdown-transition-leave-active {
  transition: all 0.2s ease;
}

.timeline-row-dropdown-transition-enter-from,
.timeline-row-dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
