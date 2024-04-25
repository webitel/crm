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
        :type="TimelinePinType.CHAT"
        @click="toggle"
      />
    </template>
    <template #content>
      <div class="chat-task-timeline-row__content">
        <timeline-row-initiator
          :text="taskInitiator.name"
          :type="taskType"
        />

        <wt-chip
          v-if="hiddenParticipants.length"
          @click="openHiddenParticipants = !openHiddenParticipants"
        >
          {{ +hiddenParticipants.length }}
        </wt-chip>

        <div v-if="openHiddenParticipants">
          <timeline-row-initiator
            v-for="user of hiddenParticipants"
            :text="user.name"
          ></timeline-row-initiator>
        </div>

        <timeline-row-duration
          :duration="duration"
        />
      </div>
    </template>

    <template #dropdown>
      <chat-points-row-section
        :chat-id="chatId"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, inject, ref, toRefs } from 'vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelinePinTypeEnum from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
import ChatPointsRowSection from '../point-row/chat-points-row-section.vue';

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
  id: chatId,
} = toRefs(props.task);

const openHiddenParticipants = ref(false);

const taskType = computed(() => gateway?.value ? TimelinePinTypeEnum.CHAT_GATEWAY : TimelinePinTypeEnum.CHAT)

const taskInitiator = computed(() => {
  if(taskType.value === TimelinePinTypeEnum.CHAT_GATEWAY) return gateway.value;
  return participants.value[0]
});
const hiddenParticipants = computed(() => participants?.value?.filter(participant => participant.id !== taskInitiator.value.id));
</script>

<style lang="scss" scoped>
.chat-task-timeline-row {
  &__content {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
    width: 100%;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    box-shadow: var(--elevation-1);
    min-height: var(--spacing-2xl);
  }
}
</style>
