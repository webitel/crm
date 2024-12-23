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
          'case-deadline__time-difference_positive': timeDifference > 0,
          'case-deadline__time-difference_negative': timeDifference < 0
        }"
      >{{ formatTimeDifference(timeDifference) }}</span>
    </div>
  </div>
</template>

<script setup>
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

function prettifyDate(timestamp) {
  console.log(timestamp);
  // timestamp is in milliseconds
  const date = new Date(Number(timestamp));

  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const datePart = date.toLocaleDateString('en-GB').replace(/\//g, '.');

  return `${time} ${datePart}`;
}

function formatTimeDifference(value) {
  //value is in seconds
  const totalSeconds = Math.abs(Number(value));
  const isNegative = value < 0;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

  const formatted = `${days}d ${hours}h ${minutes}m`;

  return isNegative ? `- ${formatted}` : formatted;
}
</script>

<style lang="scss" scoped>
.case-deadline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  &__value-wrapper {
    display: flex;
    gap: var(--spacing-xs);
    text-align: end;
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
