<template>
  <div class="timeline-day">
    <event-record>
      <template v-slot:date>
        <p class="timeline-day__title">{{ t(`contacts.timeline.dayWeek.${dayWeek}`) }}</p>
        <p class="timeline-day__title">{{ t(`contacts.timeline.mouth.${mouth}`) }}</p>
      </template>

      <template v-slot:collapse>
        <div class="timeline-day__wrapper">
          <wt-button
            color="secondary"
            class="timeline-day__button"
            @click="isOpenDay = !isOpenDay"
          >{{ dayNumber }}
          </wt-button>
          <div
            v-if="!isLastDay || (isLastDay && isOpenDay)"
            class="timeline-day__divider"></div>
        </div>
      </template>

      <template v-slot:content>
        <div class="timeline-day__counters">
          <p>{{ `${t('channel.type.call')} (${day.callsCount || 0})` }}</p>
          <p>{{ `${t('channel.type.chat')} (${day.chatsCount || 0})` }}</p>
        </div>

      </template>
    </event-record>

    <div v-if="isOpenDay">
      <opened-timeline-day
        v-for="item of props.day.items"
        :item="item"
        :key="item.id"
      ></opened-timeline-day>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import EventRecord from './utils/event-record.vue';
import OpenedTimelineDay from './opened-timeline-day.vue';

const props = defineProps({
  day: {
    type: Object,
  },
  isLastDay: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const isOpenDay = ref(false);

const fullDate = computed(() => new Date(+props.day.dayTimestamp));
const mouth = computed(() => fullDate.value.toLocaleString('en', { month: 'short' }).toLowerCase());
const dayWeek = computed(() => fullDate.value.toLocaleString('en', { weekday: 'short' }).toLowerCase());
const dayNumber = computed(() => fullDate.value.getDate());
</script>

<style lang="scss" scoped>
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
