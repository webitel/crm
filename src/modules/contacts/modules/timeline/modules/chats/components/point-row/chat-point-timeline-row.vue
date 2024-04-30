<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="point.date"
      >
        <template
          #title="{ time }"
        >
          {{ time }}
        </template>

        <template #subtitle>
          <timeline-task-status
            v-if="pointStatus"
            :status="pointStatus"
          ></timeline-task-status>

<!--           empty -->
          <div v-else />
        </template>
      </timeline-row-info>
    </template>

    <template #pin>
      <timeline-pin
        :type="pinType"
        collapsed
      />
    </template>

    <template #content="{ toggle, collapsed }">
      {{ point }}
      <wt-icon-btn
        icon="expand"
        @click="toggle"
      />
      <timeline-row-initiator
        :text="initiator"
      />
    </template>

    <template #content-dropdown>
      <chat-point-row-dropdown />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed } from 'vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
import ChatPointRowDropdown from './chat-point-timeline-row-dropdown.vue';

const props = defineProps({
  point: {
    type: Object,
    required: true,
  },
});

// TODO
const initiator = computed(() => {

});

// TODO ME!
const pinType = computed(() => {
  if (true) return TimelinePinType.USER;
  if (false) return TimelinePinType.AGENT;
  if (false) return TimelinePinType.BOT;
  throw new Error(`Unknown pin type for chat point!, ${JSON.stringify(props.point)}`);
});

// TODO
const pointStatus = computed(() => {
  if (true) return TimelineTaskStatusEnum.TRANSFERRED;
  return false;
});
</script>

<style lang="scss" scoped>

</style>
