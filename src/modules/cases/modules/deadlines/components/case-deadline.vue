<template>
  <div class="case-deadline">
    <div class="case-deadline__item-title">
      <span>{{ title }}</span>
    </div>
    <div class="case-deadline__item-content">
      <div
        v-if="time"
        class="case-deadline__value-wrapper"
      >
        <span>{{ prettifyDate(time, props.timeZone) }}</span>
      </div>
      <span
        v-if="showTimeDifference"
        class="case-deadline__time-difference"
        :class="{
          'case-deadline__time-difference_positive': numberTimeDifference >= 0,
          'case-deadline__time-difference_negative': numberTimeDifference < 0,
        }"
      >{{ convertDurationWithDays(numberTimeDifference, true) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import convertDurationWithDays from '../../../../../app/scripts/convertDurationWithDays.js';
import prettifyDate from '../../../utils/prettifyDate.js';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: '',
  },
  timeDifference: {
    type: String,
    default: null,
  },
  timeZone: {
    type: String,
    default: undefined,
  }
});

const showTimeDifference = computed(() => {
  return ['string', 'number'].includes(typeof props.timeDifference);
});

const numberTimeDifference = computed(() => {
  return Number(props.timeDifference);
});
</script>

<style lang="scss" scoped>
.case-deadline {
  gap: var(--spacing-xs);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  &__item-title {
    flex: 1;
  }

  &__value-wrapper {
    display: flex;
    text-align: end;
    gap: var(--spacing-xs);
  }

  &__item-content {
    flex: 1;
    display: flex;
    align-items: end;
    flex-direction: column;
  }

  &__time-difference {
    text-align: end;

    &_positive {
      color: var(--success-color);
    }

    &_negative {
      color: var(--error-color);
    }
  }
}
</style>
