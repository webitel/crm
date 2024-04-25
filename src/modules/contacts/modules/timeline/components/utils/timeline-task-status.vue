<template>
    <div class="timeline-task-status">
      <wt-indicator
        size="sm"
        :color=statusColor
      />
      <p>
        {{ t(`contacts.timeline.status.${ status }`) }}
      </p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineTaskStatus from '../../enums/TimelineTaskStatus.enum.js';

const props = defineProps({
  status: {
    type: String,
    default: TimelineTaskStatus.STARTED,
    validator: (value) => Object.values(TimelineTaskStatus).includes(value),
  },
});

const { t } = useI18n();

const statusColor = computed(() => {
  switch (props.status) {
    case TimelineTaskStatus.STARTED:
      return 'success';
    case TimelineTaskStatus.TRANSFERRED:
      return 'transfer';
    default:
      return 'error';
  }
});
</script>

<style lang="scss" scoped>
.timeline-task-status {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
