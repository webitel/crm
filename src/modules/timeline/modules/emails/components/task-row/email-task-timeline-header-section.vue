<template>
  <div class="email-task-timeline-header-section">
    <p>{{ title }}:</p>
    <slot name="name">
      <span class="email-task-timeline-header-section__name">{{ name }}</span>
    </slot>

    <slot name="tooltip">
      <wt-tooltip
        v-if="hiddenParticipants.length"
        :triggers="['click']"
      >
        <template #activator>
          <wt-chip> +{{ hiddenParticipants.length }} </wt-chip>
        </template>

        <div class="email-task-timeline-header-section__wrapper">
          <p
            v-for="(name, idx) of hiddenParticipants"
            :key="idx"
          >
            {{ name }}
          </p>
        </div>
      </wt-tooltip>
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
  },
  name: {
    type: String,
  },
  hiddenParticipants: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.email-task-timeline-header-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  &__name {
    @extend %typo-subtitle-1;
  }

  &__wrapper {
    padding: var(--spacing-xs);
  }
}
</style>
