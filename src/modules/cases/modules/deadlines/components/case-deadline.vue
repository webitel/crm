<template>
  <div class="case-deadline">
    <wt-label>{{ label }}</wt-label>
    <div class="case-deadline__item-content">
      <div
          v-if="time"
          class="case-deadline__value-wrapper"
      >
        <span>{{ prettifyDate(time) }}</span>
      </div>
      <span
          v-if="timeDifference"
          :class="{
          'case-deadline__time-difference_positive': Number(timeDifference) > 0,
          'case-deadline__time-difference_negative': Number(timeDifference) < 0
        }"
      >{{ convertDurationWithDays(Number(timeDifference), true) }}</span>
    </div>
  </div>
</template>

<script setup>
import convertDurationWithDays
  from '../../../../../app/scripts/convertDurationWithDays.js';
import prettifyDate from '../../../utils/prettifyDate.js';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: '',
  },
  timeDifference: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.case-deadline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  &__value-wrapper {
    display: flex;
    text-align: end;
    gap: var(--spacing-xs);
  }

  &__item-content {
    display: flex;
    align-items: end;
    flex-direction: column;
  }

  &__time-difference {
    &_positive {
      color: var(--success-color);
    }

    &_negative {
      color: var(--error-color);
    }
  }
}
</style>
