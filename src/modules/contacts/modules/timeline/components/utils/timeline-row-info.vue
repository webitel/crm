<template>
  <div class="timeline-row-info">
    <p class="timeline-row-info-title">
      <slot
        name="title"
        v-bind="timesScope"
      >
        {{ timestamp }}
      </slot>
    </p>

    <p class="timeline-row-info-subtitle">
      <slot
        name="subtitle"
        v-bind="timesScope"
      >
        {{ timestamp }}
      </slot>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  timestamp: {
    type: String,
    default: 0,
  },
});

const { d } = useI18n();

const timestampTime = computed(() => {
  const date = new Date(+props.timestamp);
  return date.toLocaleTimeString();
});

const timestampWeekDay = computed(() => {
  const date = new Date(+props.timestamp);
  return d(date, { weekday: 'long' });
});

const timestampMonth = computed(() => {
  const date = new Date(+props.timestamp);
  return d(date, { month: 'long' });
});

const timesScope = computed(() => {
  return {
    timestamp: props.timestamp,
    time: timestampTime.value,
    weekDay: timestampWeekDay.value,
    month: timestampMonth.value,
  };
});
</script>

<style lang="scss" scoped>
.timeline-row-info-title,
.timeline-row-info-subtitle {
  @extend %typo-subtitle-2;
}
</style>
