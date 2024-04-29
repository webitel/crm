<template>
  <div class="timeline-row-initiator">
    <div
      class="timeline-row-initiator__wrapper"
      v-if="type === TimelineInitiatorType.BOT"
    >
      <wt-icon
        icon="bot"
      />

      {{ text }}
    </div>

    <div
      class="timeline-row-initiator__wrapper"
      v-else-if="type === TimelineInitiatorType.FLOW"
    >
      <wt-chip color="secondary">
        {{ text }}
      </wt-chip>
    </div>

    <div
      v-else
      class="timeline-row-initiator__wrapper"
    >
      <wt-avatar
        :username="text"
        size="sm"
      />
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import TimelineInitiatorType from '../../enums/TimelineInitiatorType.enum.js';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: TimelineInitiatorType.CONTACT,
    validator: (value) => Object.values(TimelineInitiatorType).includes(value),
  },
});
</script>

<style lang="scss" scoped>
.timeline-row-initiator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.timeline-row-initiator__wrapper {
  display: contents;
}
</style>
