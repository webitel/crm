<template>
  <component
    :is="component"
    :task="task"
    :detailed="isDetailed"
    :last="last"
  />
</template>

<script setup>
import { computed } from 'vue';

import { TimelineEventType } from '../../enums/TimelineEventType';
import CallTaskTimelineRow from '../../modules/calls/components/task-row/call-task-timeline-row.vue';
import ChatTaskTimelineRow from '../../modules/chats/components/task-row/chat-task-timeline-row.vue';
import EmailTaskTimelineRow from '../../modules/emails/components/task-row/email-task-timeline-row.vue';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
	last: {
		type: Boolean,
		default: false,
	},
});

const isDetailed = computed(
	() => props.task?.isDetailed || props.task.type === TimelineEventType.Email,
);

const component = computed(() => {
	switch (props.task.type) {
		case TimelineEventType.Chat:
			return ChatTaskTimelineRow;
		case TimelineEventType.Call:
			return CallTaskTimelineRow;
		case TimelineEventType.Email:
			return EmailTaskTimelineRow;
		default:
			throw new Error(`Unknown item type, ${props.task.type}!`);
	}
});
</script>

<style lang="scss" scoped>

</style>
