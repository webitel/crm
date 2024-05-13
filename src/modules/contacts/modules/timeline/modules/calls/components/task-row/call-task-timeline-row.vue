<template>
  <timeline-row class="call-task-timeline-row">
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
        :type="pinType"
        :last="last && collapsed"
        @click="toggle"
      />
    </template>

    <template v-slot:content>
      <task-timeline-row-content-wrapper>
        <timeline-row-initiator
          :text="initiator.name"
          :type="initiatorType"
        />

        <wt-tooltip
          v-if="hiddenParticipants.length"
          :triggers="['click']"
        >
          <template #activator>
            <wt-chip>
              +{{ hiddenParticipants.length }}
            </wt-chip>
          </template>

          <timeline-row-initiator
            v-for="({ name, id }) of hiddenParticipants"
            :key="id"
            :text="name"
          />
        </wt-tooltip>

        <timeline-row-duration
          :duration="duration"
        />

        <call-task-timeline-actions
          :task="task"
        />
      </task-timeline-row-content-wrapper>
    </template>

    <template #dropdown>
      <call-points-timeline-row-section
        :task-id="taskId"
        :last="last"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelineInitiatorType from '../../../../enums/TimelineInitiatorType.enum.js';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskKind from '../../../../enums/TimelineTaskKind.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
import CallPointsTimelineRowSection from '../point-row/call-points-timeline-row-section.vue';
import CallTaskTimelineActions from './call-task-timeline-actions.vue';

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

const {
  createdAt,
  participants,
  isInbound,
  isMissed,
  duration,
  flowScheme,
  queue,
  id: taskId,
} = toRefs(props.task);

const taskType = computed(() => {
  if (isMissed?.value) return TimelineTaskKind.CALL_MISSED;
  if (isInbound?.value) return TimelineTaskKind.CALL_INBOUND;
  return TimelineTaskKind.CALL_OUTBOUND;
});

const pinType = computed(() => {
  switch (taskType.value) {
    case TimelineTaskKind.CALL_MISSED:
      return TimelinePinType.CALL_MISSED;
    case TimelineTaskKind.CALL_INBOUND:
      return TimelinePinType.CALL_INBOUND;
    case TimelineTaskKind.CALL_OUTBOUND:
      return TimelinePinType.CALL_OUTBOUND;
    default:
      throw new Error('Unknown task type for pin');
  }
});

const taskStatus = computed(() => {
  if (taskType.value === TimelineTaskKind.CALL_MISSED) return TimelineTaskStatusEnum.MISSED;
  return TimelineTaskStatusEnum.STARTED;
});

const initiatorType = computed(() => {
  // FIXME
  // if (!isMissed?.value && !queue?.value) return TimelineInitiatorType.FLOW;
  if (isMissed?.value && queue?.value) return TimelineInitiatorType.BOT;
  return TimelineInitiatorType.CONTACT;
});

const initiator = computed(() => {
  switch (initiatorType.value) {
    case TimelineInitiatorType.FLOW:
      return flowScheme?.value;
    case TimelineInitiatorType.BOT:
      return queue?.value;
    default:
      return participants?.value.at(0);
  }
});

const hiddenParticipants = computed(() => (participants?.value || [])
  .filter(({ id }) => id !== initiator.value.id),
);
</script>

<style lang="scss" scoped>
.call-task-timeline-actions {
  margin-left: auto;
}
</style>

