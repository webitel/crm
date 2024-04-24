<template>
  <div>
    <day-timeline-row
      :timestamp="day.dayTimestamp"
      :calls-count="day.callsCount"
      :chats-count="day.chatsCount"
      @toggle="opened = !opened"
    />

    <div v-if="opened">
      <task-timeline-row
        v-for="(item) of props.day.items"
        :task="item"
        :key="item.id"
      ></task-timeline-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DayTimelineRow from './day-timeline-row.vue';
import TaskTimelineRow from '../task-row/task-timeline-row.vue';

const props = defineProps({
  day: {
    type: Object,
  },
});

const opened = ref(false);
</script>

<style lang="scss" scoped>
</style>
