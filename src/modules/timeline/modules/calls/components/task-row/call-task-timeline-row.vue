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
        :last="last && collapsed"
        :non-clickable="!detailed"
        :type="pinType"
        @click="toggle"
      />
    </template>

    <template #content>
        <task-timeline-row-content-wrapper>
          <div class="call-task-timeline-row-content-wrapper">
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

            <timeline-row-duration
              v-if="totalDuration"
              is-total-duration
              :duration="totalDuration"
            />

            <call-task-timeline-actions
              :task="task"
            />
          </div>

            <wt-player
              v-if="isShowPlayer"
              :src="audioURL"
              @close="closePlayer"
            />
        </task-timeline-row-content-wrapper>

    </template>

    <template #dropdown>
      <call-points-timeline-row-section
        :last="last"
        :task-id="taskId"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, provide, ref, toRefs } from 'vue';

import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelineInitiatorType from '../../../../enums/TimelineInitiatorType.enum.js';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskKind from '../../../../enums/TimelineTaskKind.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
import CallPointsTimelineRowSection from '../point-row/call-points-timeline-row-section.vue';
import CallTaskTimelineActions from './actions/call-task-timeline-actions.vue';

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

const audioURL = ref(null);
const audioId = ref('');
const eventBus = inject('$eventBus');

provide('audioId', audioId);

const {
  createdAt,
  participants,
  isInbound,
  isMissed,
  duration,
  totalDuration,
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
  if (!isInbound?.value) return TimelineInitiatorType.CONTACT; // agent
  if (participants?.value) return TimelineInitiatorType.CONTACT;
  if (queue?.value) return TimelineInitiatorType.BOT;
  if (flowScheme?.value) return TimelineInitiatorType.FLOW;
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

function closePlayer() {
  eventBus.$emit('close-player');
  audioURL.value = '';
  audioId.value = '';
}

onMounted(() => {
  return eventBus.$on('audio-handler', ({ url, id }) => {
    if(!url || !id) return closePlayer();
    audioURL.value = url;
    audioId.value = id;
  });
});

onUnmounted(() => {
  eventBus.$off('audio-handler');
});

const isShowPlayer = computed(() => props.task.files?.find((file) => file.id === audioId.value));
</script>

<style lang="scss" scoped>
.call-task-timeline-actions {
  margin-left: auto;
}

.call-task-timeline-row-content-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.task-timeline-row-content-wrapper {
  flex-direction: column;
  align-items: stretch;
}
</style>

