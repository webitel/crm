<template>
  <article
    class="timeline-row"
    :class="{ 'timeline-row--width-fit-content': props.widthFitContent }"
  >
    <header
      class="timeline-row-header"
    >
      <section class="timeline-row-before-content">
        <slot name="before-content" />
      </section>

      <section class="timeline-row-pin">
        <slot name="pin" v-bind="{ toggle, collapsed }" />
      </section>

      <section class="timeline-row-content">
        <slot name="content" />

        <article
          class="timeline-row-content-dropdown"
          v-if="slots['content-dropdown'] && !collapsed"
        >
          <slot name="content-dropdown" v-bind="{ toggle, collapsed }" />
        </article>
      </section>

    </header>
    <transition name="fade">
      <section
        class="timeline-row-dropdown"
        v-if="slots.dropdown && !collapsed"
      >
        <slot name="dropdown" v-bind="{ toggle, collapsed }" />
      </section>
    </transition>
  </article>
</template>

<script setup>
import { ref, useSlots } from 'vue';

const props = defineProps({
  widthFitContent: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();

const collapsed = ref(true);

const toggle = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style lang="scss" scoped>
.timeline-row {
  display: flex;
  flex-direction: column;

  &-header {
    display: flex;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  &-before-content {
    flex: 0 0 120px;
  }

  &-pin {
    flex: 0 0 90px; // wt-button min width
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto 0;
  }

  &-content {
    flex: 1;
  }

  &-dropdown {
    transition: var(--transition);
  }

  &--width-fit-content {
    .timeline-row-content {
      flex: 0 0 auto;
    }
  }
}
</style>
