<template>
  <timeline-row>
    <template #before-content>
      {{ props.timestamp }}
    </template>
    <template #pin>
      <timeline-pin
        :type="TimelinePinType.DAY"
        text="dday"
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
  <!--    <event-record>-->
  <!--      <template v-slot:before-content>-->
  <!--        <p class="timeline-day__title">{{ t(`contacts.timeline.dayWeek.${dayWeek}`) }}</p>-->
  <!--        <p class="timeline-day__title">{{ t(`contacts.timeline.mouth.${mouth}`) }}</p>-->
  <!--      </template>-->

  <!--      <template v-slot:action>-->
  <!--        <div class="timeline-day__wrapper">-->
  <!--          <wt-button-->
  <!--            color="secondary"-->
  <!--            class="timeline-day__button"-->
  <!--            @click="isOpenDay = !isOpenDay"-->
  <!--          >{{ dayNumber }}-->
  <!--          </wt-button>-->
  <!--          <div-->
  <!--            v-if="!isLastDay || (isLastDay && isOpenDay)"-->
  <!--            class="timeline-day__divider"></div>-->
  <!--        </div>-->
  <!--      </template>-->

  <!--      <template v-slot:content>-->
  <!--        <div class="timeline-day__counters">-->
  <!--          <p>{{ `${t('channel.type.call')} (${day.callsCount || 0})` }}</p>-->
  <!--          <p>{{ `${t('channel.type.chat')} (${day.chatsCount || 0})` }}</p>-->
  <!--        </div>-->

  <!--      </template>-->
  <!--    </event-record>-->
</template>

<script setup>
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
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
// const fullDate = computed(() => new Date(+props.day.dayTimestamp));
// const mouth = computed(() => fullDate.value.toLocaleString('en', { month: 'short' }).toLowerCase());
// const dayWeek = computed(() => fullDate.value.toLocaleString('en', { weekday: 'short' }).toLowerCase());
// const dayNumber = computed(() => fullDate.value.getDate());

</script>

<style lang="scss" scoped>

</style>
