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
        <email-point-timeline-row
          :task="task" />

      </task-timeline-row-content-wrapper>
    </template>

  </timeline-row>
</template>
<script setup>
import { computed, toRefs } from 'vue';
import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskKind from '../../../../enums/TimelineTaskKind.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
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

const {
  createdAt,
  isInbound
} = toRefs(props.task);

const taskType = computed(() => isInbound?.value ? TimelineTaskKind.EMAIL_INBOUND : TimelineTaskKind.EMAIL_OUTBOUND);

const taskStatus = computed(() => {
  switch (taskType.value) {
    case TimelineTaskKind.EMAIL_INBOUND:
      return TimelineTaskStatusEnum.RECEIVED;
    case TimelineTaskKind.EMAIL_OUTBOUND:
      return TimelineTaskStatusEnum.SENT;
    default:
      throw new Error(`Unknown task type: ${taskType.value}`);
  }
});

const pinType = computed(() => {
  switch (taskType.value) {
    case TimelineTaskKind.EMAIL_INBOUND:
      return TimelinePinType.EMAIL_INBOUND;
    case TimelineTaskKind.EMAIL_OUTBOUND:
      return TimelinePinType.EMAIL_OUTBOUND;
    default:
      throw new Error(`Unknown task type: ${taskType.value}`);
  }
});

</script>
