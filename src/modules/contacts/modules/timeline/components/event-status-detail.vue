<template>
  <div class="event-status-detail">
    <span class="event-status-detail__time">{{ eventTime }}</span>
    <div class="event-status-detail__inner">
      <wt-indicator
        size="sm"
        :color=statusColor
      ></wt-indicator>
      <p>{{ t(`contacts.timeline.status.${ status }`) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  time: {
    type: Number,
  },
  status: {
    type: String,
    default: 'started',
    options: ['started', 'missed', 'transferred', 'ended'],
  },
});

const { t } = useI18n();

const eventTime = computed(() => new Date(+props.time).toLocaleTimeString());
const statusColor = computed(() => {
  switch (props.status) {
    case 'started':
      return 'success';
    case 'transferred':
      return 'transfer';
    default:
      return 'error';
  }
});
</script>

<style lang="scss" scoped>
.event-status-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  &__time {
    @extend %typo-subtitle-2;
  }

  &__inner {
    @extend %typo-body-2;
    display: flex;
    align-items: baseline;
  }
}
</style>
