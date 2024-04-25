<template>
  <div class="chat-task-timeline-row">
    <timeline-row>
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
          :type="taskType"
          @click="toggle"
        ></timeline-pin>
      </template>

      <template v-slot:content>
        <div class="call-task-timeline-row__content">
          <div class="call-task-timeline-row__wrapper">
            <timeline-row-initiator
              :type="taskType"
              :text="taskInitiator.name"
            ></timeline-row-initiator>

            <wt-chip
              v-if="hiddenParticipants.length"
              @click="openHiddenParticipants = !openHiddenParticipants"
            >{{ +hiddenParticipants.lenght }}
            </wt-chip>

            <div v-if="openHiddenParticipants">
              <timeline-row-initiator
                v-for="user of hiddenParticipants"
                :text="user.name"
              ></timeline-row-initiator>
            </div>

            <timeline-row-duration
              :duration="duration"
            ></timeline-row-duration>

          </div>

          <call-task-timeline-actions
            v-if="taskType !== TimelinePinTypeEnum.CHAT"
            :id="id"
          ></call-task-timeline-actions>

        </div>
      </template>

    </timeline-row>
  </div>
</template>

<script setup>
import { computed, toRefs, ref } from 'vue';
import TimelinePinTypeEnum from '../../enums/TimelinePinType.enum.js';
import TimelineTaskStatusEnum from '../../enums/TimelineTaskStatus.enum.js';
import TimelinePin from '../utils/timeline-pin.vue';
import TimelineRowDuration from '../utils/timeline-row-duration.vue';
import TimelineRowInfo from '../utils/timeline-row-info.vue';
import TimelineRowInitiator from '../utils/timeline-row-initiator.vue';
import TimelineRow from '../utils/timeline-row.vue';
import TimelineTaskStatus from '../utils/timeline-task-status.vue';
import CallTaskTimelineActions from '../call-task-actions/call-task-timeline-actions.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
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
  id,
} = toRefs(props.task);

const openHiddenParticipants = ref(false);

const taskType = computed(() => {
  if(isInbound.value) {
    if (isMissed?.value) {
      return queue?.value ? TimelinePinTypeEnum.CALL_MISSED_ON_QUEUE : TimelinePinTypeEnum.CALL_MISSED;
    } else {
      return !queue?.value ? TimelinePinTypeEnum.CALL_INBOUND_ON_IVR : TimelinePinTypeEnum.CALL_INBOUND;
    }
  } return TimelinePinTypeEnum.CALL_OUTBOUND;
});

const taskStatus = computed(() => taskType.value.includes(TimelinePinTypeEnum.CALL_MISSED)
  ? TimelineTaskStatusEnum.MISSED
  : TimelineTaskStatusEnum.STARTED);

const taskInitiator = computed(() => {
  switch (taskType.value) {
    case TimelinePinTypeEnum.CALL_INBOUND_ON_IVR:
      return flowScheme.value;
    case TimelinePinTypeEnum.CALL_MISSED_ON_QUEUE:
      return queue.value;
    default:
      return participants.value[0];
  }
});

const hiddenParticipants = computed(() => participants?.value?.filter(participant => participant.id !== taskInitiator.value.id));
</script>

<style lang="scss" scoped>
.call-task-timeline-row {
  &__content {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    box-shadow: var(--elevation-1);
    min-height: var(--spacing-2xl);
  }

  &__wrapper {
    display: flex;
    gap: var(--spacing-sm);
  }
}
</style>

