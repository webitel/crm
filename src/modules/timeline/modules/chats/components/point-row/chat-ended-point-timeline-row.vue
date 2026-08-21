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
            :status="TimelineTaskStatusEnum.Ended"
          />
        </template>
      </timeline-row-info>
    </template>

    <template #pin>
      <timeline-pin
        :type="TimelinePinType.ChatEnd"
        :last="last"
        collapsed
      />
    </template>
  </timeline-row>
</template>

<script setup lang="ts">
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import { TimelinePinType } from '../../../../enums/TimelinePinType.enum';
import { TimelineTaskStatus as TimelineTaskStatusEnum } from '../../../../enums/TimelineTaskStatus.enum';

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
</script>

<style scoped lang="scss">

</style>
