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

const props = defineProps({
  status: {
    type: String,
    default: 'started',
    options: ['started', 'missed', 'transferred', 'ended'],
  },
});

const { t } = useI18n();

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
.timeline-task-status {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
