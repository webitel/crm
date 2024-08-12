<template>
  <div class="call-task-timeline-actions">
    <call-task-timeline-action-play-recording
      v-if="task.files"
      :files="task.files"
    />

    <call-task-timeline-action-history-link
      :id="task.id"
    />
  </div>
</template>
<script setup>
import CallTaskTimelineActionHistoryLink from './call-task-timeline-action-history-link.vue';
import CallTaskTimelineActionPlayRecording from './call-task-timeline-action-play-recording.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

</script>

<style lang="scss" scoped>
.call-task-timeline-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);
}
</style>
