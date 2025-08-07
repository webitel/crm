<template>
  <section class="timeline-container">
    <header class="timeline-header">
      <slot name="header" />
    </header>

    <article class="timeline-content">
      <slot name="content" />

      <slot name="after-content" />
    </article>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.timeline-content {
  @extend %wt-scrollbar;
  height: 100%;
  padding: var(--spacing-sm);
}
</style>
