<template>
    <div class="timeline-task-status">
      <wt-indicator
        size="sm"
        :color=statusColor
      ></wt-indicator>
      <p>{{ t(`contacts.timeline.status.${ status }`) }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineTaskStatusEnum from '../../enums/TimelineTaskStatus.enum.js';

const props = defineProps({
  status: {
    type: String,
    default: TimelineTaskStatusEnum.STARTED,
    options: [TimelineTaskStatusEnum.STARTED, TimelineTaskStatusEnum.MISSED, TimelineTaskStatusEnum.TRANSFERRED, TimelineTaskStatusEnum.ENDED],
  },
});

const { t } = useI18n();

const statusColor = computed(() => {
  switch (props.status) {
    case TimelineTaskStatusEnum.STARTED:
      return 'success';
    case TimelineTaskStatusEnum.TRANSFERRED:
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
