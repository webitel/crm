<template>
  <div class="timeline-row-initiator">
    <div
      v-if="type === TimelineInitiatorType.BOT"
      style="display: contents;"
    >
      <wt-icon
        icon="bot"
      />

      {{ text }}
    </div>

    <div
      v-else-if="type === TimelineInitiatorType.FLOW"
      style="display: contents;"
    >
      <wt-chip color="secondary">
        {{ text }}
      </wt-chip>
    </div>

    <div
      v-else
      style="display: contents;"
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
  gap: var(--spacing-sm);
}

</style>
