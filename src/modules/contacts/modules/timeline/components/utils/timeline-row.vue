<template>
  <article
    class="timeline-row"
    :class="{ 'timeline-row--width-fit-content': props.widthFitContent }"
  >
    <section class="timeline-row-before-content">
      <slot name="before-content" />
    </section>

    <section class="timeline-row-pin">
      <slot name="pin" />
    </section>

    <section class="timeline-row-content">
      <slot name="content" />
    </section>

    <section
      v-if="slots['after-content']"
      class="timeline-row-after-content"
    >
      <slot name="after-content" />
    </section>
  </article>
</template>

<script setup>
import { useSlots } from 'vue';

const props = defineProps({
  widthFitContent: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
</script>

<style  lang="scss" scoped>
.timeline-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.timeline-row-before-content {
  flex: 0 0 120px;
}

.timeline-row-pin {
  flex: 0 0 90px; // wt-button min width
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
}

.timeline-row-content {
  flex: 1;
}

.timeline-row-after-content {
  flex: 0 0 24px;
}

.timeline-row--width-fit-content {
  .timeline-row-content {
    flex: 0 0 auto;
  }
}
</style>
