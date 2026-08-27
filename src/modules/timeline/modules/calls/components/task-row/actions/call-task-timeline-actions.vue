<template>
  <div class="call-task-timeline-actions">
    <call-task-timeline-action-play-recording
      v-if="task.files"
      :files="task.files"
    />

    <call-task-timeline-action-transcription
      v-if="task.transcripts"
      :created-at="task.createdAt"
      :transcripts="task.transcripts"
    />

    <timeline-action-menu
      :task="task"
    />
  </div>
</template>
<script setup>
import TimelineActionMenu from '../../../../../components/task-row/timeline-action-menu.vue';
import CallTaskTimelineActionPlayRecording from './call-task-timeline-action-play-recording.vue';
import CallTaskTimelineActionTranscription from './call-task-timeline-action-transcription.vue';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
});
</script>

<style scoped>
.call-task-timeline-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);
}
</style>
