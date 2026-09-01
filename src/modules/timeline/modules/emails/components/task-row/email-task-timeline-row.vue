<template>
  <timeline-row class="email-task-timeline-row">
    <template #before-content>
      <timeline-row-info
        :timestamp="createdAt"
      >
        <template #title="{ time }">
          {{ time }}
        </template>

        <template #subtitle>
          <timeline-task-status :status="taskStatus" />
        </template>
      </timeline-row-info>
    </template>

    <template #pin="{ toggle, collapsed }">
      <timeline-pin
        :collapsed="collapsed"
        :last="last && collapsed"
        :non-clickable="!detailed"
        :type="pinType"
        @click="toggle"
      />
    </template>

    <template #content>
      <task-timeline-row-content-wrapper>
        <div class="email-task-timeline-row-info">
          <email-point-timeline-row
            :task="task" />
        </div>

        <timeline-action-menu
          :task="task"
        />
      </task-timeline-row-content-wrapper>
    </template>

  </timeline-row>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';

import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelineActionMenu from '../../../../components/task-row/timeline-action-menu.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import { TimelinePinType } from '../../../../enums/TimelinePinType.enum';
import { TimelineTaskKind } from '../../../../enums/TimelineTaskKind.enum';
import { TimelineTaskStatus as TimelineTaskStatusEnum } from '../../../../enums/TimelineTaskStatus.enum';
import EmailPointTimelineRow from '../point-row/email-point-timeline-row.vue';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
	detailed: {
		type: Boolean,
		default: false,
	},
	last: {
		type: Boolean,
		default: false,
	},
});

const { createdAt, isInbound } = toRefs(props.task);

const taskType = computed(() =>
	isInbound?.value
		? TimelineTaskKind.EmailInbound
		: TimelineTaskKind.EmailOutbound,
);

const taskStatus = computed(() => {
	switch (taskType.value) {
		case TimelineTaskKind.EmailInbound:
			return TimelineTaskStatusEnum.Received;
		case TimelineTaskKind.EmailOutbound:
			return TimelineTaskStatusEnum.Sent;
		default:
			throw new Error(`Unknown task type: ${taskType.value}`);
	}
});

const pinType = computed(() => {
	switch (taskType.value) {
		case TimelineTaskKind.EmailInbound:
			return TimelinePinType.EmailInbound;
		case TimelineTaskKind.EmailOutbound:
			return TimelinePinType.EmailOutbound;
		default:
			throw new Error(`Unknown task type: ${taskType.value}`);
	}
});
</script>

<style scoped>
.email-task-timeline-row-info {
  flex: 1;
}
</style>
