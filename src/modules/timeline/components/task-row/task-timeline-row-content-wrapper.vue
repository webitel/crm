<template>
  <div
    class="task-timeline-row-content-wrapper"
    :class="senderTypeClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { TimelineInitiatorType } from '../../enums/TimelineInitiatorType.enum';

const props = defineProps<{
	senderType?: TimelineInitiatorType | null;
}>();

const senderTypeClass = computed(() => {
	if (!props.senderType) return null;

	return `task-timeline-row-content-wrapper--${props.senderType}`;
});
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

  &--agent {
    background-color: var(--wt-crm-components-timeline-colors-operator-background);
  }

  &--contact {
    background-color: var(--wt-crm-components-timeline-colors-client-background);
  }

  &--bot {
    background-color: var(--wt-crm-components-timeline-colors-bot-background);
  }
}
</style>
