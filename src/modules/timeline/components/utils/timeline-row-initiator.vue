<template>
  <div class="timeline-row-initiator typo-subtitle-1">
    <div
      v-if="type === TimelineInitiatorType.Bot"
      class="timeline-row-initiator__wrapper"
    >
      <wt-icon icon="bot" />

      {{ text }}
    </div>

    <div
      v-else-if="type === TimelineInitiatorType.Flow"
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

<script setup lang="ts">
import { TimelineInitiatorType } from '../../enums/TimelineInitiatorType.enum';

const props = defineProps({
	text: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: TimelineInitiatorType.Contact,
		validator: (value: string) =>
			Object.values(TimelineInitiatorType).includes(
				value as TimelineInitiatorType,
			),
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
