<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="point.date"
      >
        <template #title="{ time }">
          {{ time }}
        </template>
        <template #subtitle>
          <timeline-task-status
            :status="TimelineTaskStatusEnum.ENDED"
          />
        </template>
      </timeline-row-info>
    </template>

    <template #pin>
      <timeline-pin
        :type="TimelinePinType.CHAT_END"
        collapsed
      />
    </template>
  </timeline-row>
</template>

<script setup>
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineTaskStatusEnum from '../../../../enums/TimelineTaskStatus.enum.js';

const props = defineProps({
  point: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">

</style>
