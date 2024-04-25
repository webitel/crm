<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="timestamp"
      >
        <template #title="{ weekDay }">
          {{ weekDay }}
        </template>
       <template #subtitle="{ month }">
         {{ month }}
       </template>
      </timeline-row-info>
    </template>

    <template #pin="{ toggle, collapsed }">
      <timeline-pin
        :collapsed="collapsed"
        :type="TimelinePinType.DAY"
        :text="dayNumber"
        @click="toggle"
      ></timeline-pin>
    </template>

    <template v-slot:content>
      <day-timeline-row-counters
        :callsCount="props.callsCount"
        :chatsCount="props.chatsCount"
      />
    </template>

    <template #dropdown>
      <task-timeline-row
        v-for="(task) of tasks"
        :task="task"
        :key="task.id"
      ></task-timeline-row>
    </template>
  </timeline-row>
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TaskTimelineRow from '../task-row/task-timeline-row.vue';
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
  tasks: {
    type: Array,
    default: () => [],
  },
});

const dayNumber = computed(() => `${new Date(+props.timestamp).getDate()}`);

</script>

<style lang="scss" scoped>

</style>
