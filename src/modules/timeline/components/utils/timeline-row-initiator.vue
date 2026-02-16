<template>
  <div class="timeline-row-initiator typo-subtitle-1">
    <div
      v-if="type === TimelineInitiatorType.BOT"
      class="timeline-row-initiator__wrapper"
    >
      <wt-icon icon="bot" />

      {{ text }}
    </div>

    <div
      v-else-if="type === TimelineInitiatorType.FLOW"
      class="timeline-row-initiator__wrapper"
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

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.timeline-row-initiator {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  .wt-icon,
  .wt-avatar {
    flex-shrink: 0;
  }
}

.timeline-row-initiator__wrapper {
  display: contents;
}
</style>
