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
          />

          <!--           empty -->
          <div v-else />
        </template>
      </timeline-row-info>
    </template>

    <template #pin>
      <timeline-pin
        :type="pinType"
        :last="last"
        collapsed
      />
    </template>

    <template #content>
      <task-timeline-row-content-wrapper>
        <chat-point-row-content
          :point="point"
        />
      </task-timeline-row-content-wrapper>
    </template>
  </timeline-row>
</template>

<script setup>
import { computed } from 'vue';

import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';
import ChatPointRowContent from './chat-point-timeline-row-content.vue';

const props = defineProps({
	point: {
		type: Object,
		required: true,
	},
	last: {
		type: Boolean,
		default: false,
	},
});

const pinType = computed(() => {
	if (props.point.peer?.type === 'user') return TimelinePinType.AGENT;
	if (props.point.peer?.type === 'bot') return TimelinePinType.BOT;
	return TimelinePinType.USER;
});

// transfer is not implemented
const pointStatus = computed(() => {
	if (false) return TimelineTaskStatusEnum.TRANSFERRED;
	return false;
});
</script>

<style lang="scss" scoped>

</style>
