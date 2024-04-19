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

const props = defineProps({
  timestamp: {
    type: String,
    default: 0,
  },
});

const timestampTime = computed(() => {
  const date = new Date(+props.timestamp);
  return date.toLocaleTimeString();
});

const timestampWeekDay = computed(() => {
  const date = new Date(+props.timestamp);
  return date.toLocaleDateString();
});

const timestampMonth = computed(() => {
  const date = new Date(+props.timestamp);
  return date.toLocaleDateString();
});

const timesScope = computed(() => {
  return {
    timestamp: props.timestamp,
    time: timestampTime,
    weekDay: timestampWeekDay,
    month: timestampMonth,
  };
});
</script>

<style lang="scss" scoped>
// TODO
</style>
