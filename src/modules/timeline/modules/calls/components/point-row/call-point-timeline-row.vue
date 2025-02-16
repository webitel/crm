<template>
  <timeline-row width-fit-content>
    <template #before-content>
      <timeline-row-info
        :timestamp="point.createdAt"
      >
        <template #title="{ time }">
          {{ time }}
        </template>

        <template #subtitle>
          <timeline-task-status
            :status="pointStatus"
          />
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
        <timeline-row-initiator
          :text="initiator"
          :type="initiatorType"
        />

        <timeline-row-duration
          :duration="point.duration"
        />
      </task-timeline-row-content-wrapper>
    </template>
  </timeline-row>
</template>

<script setup>
import { computed } from 'vue';
import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelineTaskKind from '../../../../enums/TimelineTaskKind.enum.js';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';

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

const pointStatus = computed(() => {
  return TimelineTaskStatusEnum.TRANSFERRED;
});

const pinType = computed(() => {
  return TimelinePinType.CALL_TRANSFER;
});

const initiatorType = computed(() => {
  return props.point?.to?.type || props.point?.from?.type;
});

const initiator = computed(() => {
  return props.point?.to?.name || props.point?.from?.name;
});
</script>

<style lang="scss" scoped>

</style>
