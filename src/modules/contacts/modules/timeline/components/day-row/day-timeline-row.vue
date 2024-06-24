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
        :first="first"
        :last="last && collapsed"
        @click="toggle"
      />
    </template>

    <template #content>
      <day-timeline-row-counters
        :calls-count="callsCount"
        :chats-count="chatsCount"
      />
    </template>

    <template #dropdown>
      <task-timeline-row
        v-for="(task) of tasks"
        :key="task.id"
        :task="task"
        :last="last && task === tasks[tasks.length - 1]"
      />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TaskTimelineRow from '../task-row/task-timeline-row.vue';
import TimelinePin from '../utils/timeline-pin.vue';
import TimelineRowInfo from '../utils/timeline-row-info.vue';
import TimelineRow from '../utils/timeline-row.vue';
import DayTimelineRowCounters from './day-timeline-row-counters.vue';

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
  first: {
    type: Boolean,
    default: false,
  },
  last: {
    type: Boolean,
    default: false,
  },
});

const dayNumber = computed(() => `${new Date(+props.timestamp).getDate()}`);

</script>

<style lang="scss" scoped>

</style>
