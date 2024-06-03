<template>
  <div class="task-timeline-row-content-wrapper">
    <slot />
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.task-timeline-row-content-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px; // wt-avatar height
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  box-shadow: var(--elevation-1);
  gap: var(--spacing-sm);
}
</style>
