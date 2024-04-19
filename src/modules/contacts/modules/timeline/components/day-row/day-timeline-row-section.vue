<template>
  <div class="day-timeline-row-section">
    <day-timeline-row
      :timestamp="props.day.dayTimestamp"
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
import { useI18n } from 'vue-i18n';
import DayTimelineRow from './day-timeline-row.vue';
import TaskTimelineRow from '../task-row/task-timeline-row.vue';

const props = defineProps({
  day: {
    type: Object,
  },
  // TODO!!
  isLastDay: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const opened = ref(false);
</script>

<style lang="scss" scoped>
// TODO
.timeline-day {
  &__title {
    @extend %typo-subtitle-2;
  }

  &__wrapper {
    position: relative;
  }

  &__divider {
    height: var(--spacing-sm);
    width: 1px;
    position: relative;
    display: block;
    background-color: var(--btn-secondary-color);
    bottom: 0;
    left: 50%;
    transform: translate(50%, 0);
  }

  &__counters {
    @extend %typo-body-2;
    display: flex;
    gap: var(--spacing-sm);
    justify-content: end;
  }
}
</style>
