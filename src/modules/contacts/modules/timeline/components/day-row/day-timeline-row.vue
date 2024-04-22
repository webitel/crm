<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="timestamp"
      >
        <template #title="timesScope">{{ timesScope.weekDay }}</template>
        <template #subtitle="timesScope">{{ timesScope.month }}</template>
      </timeline-row-info>
      {{ props.timestamp }}
    </template>
    <template #pin>
      <timeline-pin
        :type="TimelinePinType.DAY"
        :text="dayNumber"
        @click="emit('toggle')"
      ></timeline-pin>
    </template>
    <template v-slot:content>
      <day-timeline-row-counters
        :callsCount="props.callsCount"
        :chatsCount="props.chatsCount"
      />
    </template>
  </timeline-row>


  <!--    // TODO -> day-task-line -->
  <!--      <template v-slot:before-content>-->
  <!--        <p class="timeline-day__title">{{ t(`contacts.timeline.dayWeek.${dayWeek}`) }}</p>-->
  <!--        <p class="timeline-day__title">{{ t(`contacts.timeline.mouth.${mouth}`) }}</p>-->
  <!--      </template>-->
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TimelineRowInfo from '../utils/timeline-row-info.vue';
import DayTimelineRowCounters from './day-timeline-row-counters.vue';
import TimelinePin from '../utils/timeline-pin.vue';
import TimelineRow from '../utils/timeline-row.vue';

const props = defineProps({
  timestamp: {
    type: Number,
    required: true,
  },
  callsCount: {
    type: Number,
    default: 0,
  },
  chatsCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  'toggle',
]);

// TODO -> day-task-line
const dayNumber = computed(() => new Date(+props.timestamp).getDate());

</script>

<style lang="scss" scoped>

</style>
