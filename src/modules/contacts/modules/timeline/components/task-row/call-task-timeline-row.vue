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

      <template v-slot:pin>
        <timeline-pin
          :type="taskType"
        ></timeline-pin>
      </template>

      <template v-slot:content>
        <div class="chat-task-timeline-row-content">
          <timeline-row-initiator
            :type="taskType"
            :text="taskInitiator"
          ></timeline-row-initiator>

          <wt-chip
            v-if="hiddenUsers.lenght"
            @click="openHiddenUsers = !openHiddenUsers"
          >{{ +hiddenUsers.lenght }}
          </wt-chip>

          <div v-if="openHiddenUsers">
            <timeline-row-initiator
              v-for="user of hiddenUsers"
              :text="user.name"
            ></timeline-row-initiator>
          </div>

          <timeline-row-duration
            :duration="duration"
          ></timeline-row-duration>
        </div>
      </template>

        <template v-slot:after-content>
          <call-task-timeline-actions
            v-if="taskType !== TimelinePinTypeEnum.CHAT"
            :id="id"
          ></call-task-timeline-actions>
        </template>
    </timeline-row>
  </div>
</template>

<script setup>
import { computed, toRefs, ref } from 'vue';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
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
  item: {
    type: Object,
    required: true,
  },
});

const {
  createdAt,
  participants,
  type,
  isMissed,
  duration,
  flowScheme,
  queue,
  id,
} = toRefs(props.item);

const openHiddenUsers = ref(false);
const hiddenUsers = computed(() => participants.value.filter((participant, idx) => idx));

const taskType = computed(() => {
  if (type.value === WebitelContactsTimelineEventType.Chat) {
    return TimelinePinTypeEnum.CHAT;
  } else {
    if (isMissed?.value) {
      if (queue?.value) return TimelinePinTypeEnum.CALL_MISSED_ON_QUEUE;
      return TimelinePinTypeEnum.CALL_MISSED;
    } else {
      if (!queue?.value) return TimelinePinTypeEnum.CALL_INBOUND_ON_IVR;
      return TimelinePinTypeEnum.CALL_INBOUND;
    }
    return TimelinePinTypeEnum.CALL_OUTBOUND;
  }
});

const taskStatus = computed(() => taskType.value.includes(TimelinePinTypeEnum.CALL_MISSED)
  ? TimelineTaskStatusEnum.MISSED
  : TimelineTaskStatusEnum.STARTED);

const taskInitiator = computed(() => {
  switch (taskType.value) {
    case TimelinePinTypeEnum.CALL_INBOUND_ON_IVR:
      return flowScheme.value.name;
    case TimelinePinTypeEnum.CALL_MISSED_ON_QUEUE:
      return queue.value.name;
    default:
      return participants.value[0].name;
  }
});
</script>

<style lang="scss" scoped>
.chat-task-timeline-row-content {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  box-shadow: var(--elevation-1);
}
</style>

