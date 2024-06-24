<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="createdAt"
      >
        <template #title="{ time }">
          {{ time }}
        </template>

        <template #subtitle>
          <timeline-task-status
            :status="TimelineTaskStatusEnum.STARTED"
          />
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
            v-for="({ id, name }) of hiddenParticipants"
            :key="id"
            :text="name"
          />
        </wt-tooltip>

        <timeline-row-duration
          v-if="task.closedAt"
          :duration="duration"
        />
      </task-timeline-row-content-wrapper>
    </template>

    <template #dropdown>
      <chat-points-row-section
        :last="last"
        :task="task"
        :task-id="taskId"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, inject, toRefs } from 'vue';
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
import ChatPointsRowSection from '../point-row/chat-points-timeline-row-section.vue';

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

const namespace = inject('namespace');

const {
  createdAt,
  participants,
  duration,
  gateway,
  id: taskId,
} = toRefs(props.task);

const taskType = computed(() => {
  return TimelineTaskKind.CHAT_INBOUND;
});

const pinType = computed(() => {
  switch (taskType.value) {
    case TimelineTaskKind.CHAT_INBOUND:
      return TimelinePinType.CHAT_INBOUND;
    default:
      throw new Error(`Unknown task type: ${taskType.value}`);
  }
});

const initiatorType = computed(() => {
  if (!participants.value) return TimelineInitiatorType.BOT;
  return TimelineInitiatorType.CONTACT;
});

const initiator = computed(() => {
  switch (initiatorType.value) {
    case TimelineInitiatorType.BOT:
      return gateway.value;
    default:
      return participants?.value.at(0);
  }
});

const hiddenParticipants = computed(() => (
  (participants?.value || []).filter((participant) => participant.id !== initiator.value.id)
));

</script>

<style lang="scss" scoped>

</style>
