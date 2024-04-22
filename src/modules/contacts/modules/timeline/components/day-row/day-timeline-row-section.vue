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
        :item="item"
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
//// TODO
//.day-timeline-row-section {
//  &__title {
//    @extend %typo-subtitle-2;
//  }
//
//  &__wrapper {
//    position: relative;
//  }
//
//  &__divider {
//    height: var(--spacing-sm);
//    width: 1px;
//    position: relative;
//    display: block;
//    background-color: var(--btn-secondary-color);
//    bottom: 0;
//    left: 50%;
//    transform: translate(50%, 0);
//  }
//
//  &__counters {
//    @extend %typo-body-2;
//    display: flex;
//    gap: var(--spacing-sm);
//    justify-content: end;
//  }
//}
</style>
