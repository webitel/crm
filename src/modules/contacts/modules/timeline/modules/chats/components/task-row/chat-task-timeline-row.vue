<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="createdAt"
      >
        <!--        TODO use correct time computed -->
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
        :type="pinType"
        @click="toggle"
      />
    </template>

    <template #content>
      <div class="chat-task-timeline-row__content">
        <timeline-row-initiator
          :text="initiator.name"
          :type="taskType"
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
          :duration="duration"
        />
      </div>
    </template>

    <template #dropdown>
      <chat-points-row-section
        :task-id="taskId"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, inject, toRefs } from 'vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskKind from '../../../../enums/TimelineTaskKind.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
import ChatPointsRowSection from '../point-row/chat-points-timeline-row-section.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
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
  if (gateway.value) return TimelineTaskKind.CHAT_INBOUND;
  return TimelinePinType.CHAT_INBOUND;
});

const pinType = computed(() => {
  switch(taskType.value) {
    case TimelineTaskKind.CHAT_INBOUND:
      return TimelinePinType.CHAT_INBOUND;
    default:
      throw new Error(`Unknown task type: ${taskType.value}`);
  }
});

const initiator = computed(() => {
  if (participants) return participants.value.at(0);
  if (gateway.value) return gateway.value;
  throw new Error(`No initiator found: ${JSON.stringify(props.task)}`);
});

const hiddenParticipants = computed(() => (
  (participants?.value || []).filter((participant) => participant.id !== initiator.value.id)
));

</script>

<style lang="scss" scoped>
.chat-task-timeline-row {
  &__content {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--spacing-2xl);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    box-shadow: var(--elevation-1);
    gap: var(--spacing-sm);
  }
}
</style>
