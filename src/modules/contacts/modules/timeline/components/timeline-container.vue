<template>
  <section
    class="timeline-container"
  >
    <header class="timeline-header">
      <slot name="header"></slot>
    </header>

    <article class="timeline-content">
      <slot name="content"></slot>
    </article>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.timeline-content {
  @extend %wt-scrollbar;
  overflow: auto;
  padding: var(--spacing-sm);
}
</style>
