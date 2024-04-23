<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="createdAt"
      >
        <template
          #title="{ time }"
        ></template>

        <template #subtitle>
          <timeline-task-status
            :status="taskStatus"
          />
        </template>
      </timeline-row-info>
    </template>
    <template #pin="{ toggle, collapsed }">
      <timeline-pin
        :collapsed="collapsed"
        :type="taskType"
        @click="toggle"
      />
    </template>
    <template #content>
      <timeline-row-initiator
        :text="initiator"
        :type="taskType"
      />

      <wt-chip
        v-if="hiddenParticipants.length"
      >
        {{ +hiddenParticipants.length }}
      </wt-chip>

      <timeline-row-duration
        :duration="duration"
      />
    </template>

    <template #dropdown>
      <chat-points-row-section
        :chat-id="chatId"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, inject, toRefs } from 'vue';
import { useStore } from 'vuex';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskStatus from '../../../../enums/TimelineTaskStatus.enum.js';
import ChatPointsRowSection from '../point-row/chat-points-row-section.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const namespace = inject('namespace');

const {
  createdAt,
  participants,
  type,
  duration,
  flowScheme,
  queue,
  id: chatId,
} = toRefs(props.item);

const store = useStore();

const taskStatus = computed(() => {
  return TimelineTaskStatus.STARTED;
});

const taskType = computed(() => {
  return TimelinePinType.CHAT;
});

const initiator = computed(() => {
  return 'initiator';
  // return participants.value[0];
});

const hiddenParticipants = computed(() => {
  return [];
  // return participants.value.filter((participant) => participant !== initiator.value);
});

</script>

<style lang="scss" scoped>

</style>
