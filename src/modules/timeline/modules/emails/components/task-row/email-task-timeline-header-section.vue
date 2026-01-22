<template>
  <div class="email-task-timeline-header-section">
    <p>{{ title }}:</p>
    <slot name="name">
      <span class="email-task-timeline-header-section__name typo-subtitle-1">{{ name }}</span>
    </slot>

    <slot name="tooltip">
      <wt-popover v-if="hiddenParticipants.length">
        <template #activator="{ toggle }">
          <div @click="toggle">
            <wt-chip> +{{ hiddenParticipants.length }} </wt-chip>
          </div>
        </template>

        <div class="email-task-timeline-header-section__wrapper">
          <p
            v-for="(participantName, idx) of hiddenParticipants"
            :key="idx"
          >
            {{ participantName }}
          </p>
        </div>
      </wt-popover>
    </slot>
  </div>
</template>

<script setup>
import { WtPopover } from '@webitel/ui-sdk/components';

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

<style
  scoped
  lang="scss"
>
@use '@webitel/ui-sdk/src/css/main' as *;

.email-task-timeline-header-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);


  &__wrapper {
    padding: var(--spacing-xs);
  }
}
</style>
