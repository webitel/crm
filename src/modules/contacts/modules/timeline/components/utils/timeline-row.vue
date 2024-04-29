<template>
  <article
    :class="{ 'timeline-row--width-fit-content': widthFitContent }"
    class="timeline-row"
  >
    <section class="timeline-row-self-content">
      <section class="timeline-row-before-content">
        <slot name="before-content" />
      </section>

      <section class="timeline-row-pin">
        <slot name="pin" v-bind="{ toggle, collapsed }" />
      </section>

      <section class="timeline-row-main-content">
        <header class="timeline-row-main-content-header">
          <slot name="content" />
        </header>

        <timeline-row-dropdown-transition
          v-if="slots['content-dropdown']"
        >
          <article
            v-if="!collapsed"
            class="timeline-row-content-dropdown"
          >
            <slot name="content-dropdown" v-bind="{ toggle, collapsed }" />
          </article>
        </timeline-row-dropdown-transition>
      </section>
    </section>

    <timeline-row-dropdown-transition
      v-if="slots.dropdown"
    >
      <section
        v-if="!collapsed"
        class="timeline-row-dropdown"
      >
        <slot name="dropdown" v-bind="{ toggle, collapsed }" />
      </section>
    </timeline-row-dropdown-transition>
  </article>
</template>

<script setup>
import { inject, onMounted, onUnmounted, ref, useSlots } from 'vue';
import TimelineRowDropdownTransition from './timeline-row-dropdown-transition.vue';

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

const collapseRow = () => {
  if (!collapsed.value) toggle();
};

const eventBus = inject('$eventBus');

onMounted(() => eventBus.$on('timeline/rows/collapse-all', collapseRow));

onUnmounted(() => eventBus.$off('timeline/rows/collapse-all', collapseRow));
</script>

<style lang="scss" scoped>
.timeline-row {
  display: flex;
  flex-direction: column;
}

.timeline-row-self-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  min-height: 56px;
}

.timeline-row-before-content {
  flex: 0 0 120px;
}

.timeline-row-pin {
  flex: 0 0 90px; // wt-button min width
  align-self: stretch;
}

.timeline-row-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}
</style>
