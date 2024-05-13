<template>
  <div class="chat-points-row-section">
    <chat-point-timeline-row
      v-for="(point) of points"
      :key="point.id"
      :point="point"
      :last="last && task.closedAt && point === points[points.length - 1]"
    />
    <chat-ended-point-timeline-row
      v-if="task.closedAt"
      :last="last"
      :point="{ date: task.closedAt }"
    />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useTaskPoints } from '../../../../composables/useTaskPoints.js';
import ChatEndedPointTimelineRow from './chat-ended-point-timeline-row.vue';
import ChatPointTimelineRow from './chat-point-timeline-row.vue';

const props = defineProps({
  taskId: {
    type: String,
    required: true,
  },
  /**
   * @type {Object}
   * @description Task object is needed to display "ended" stub with task.closedAt
   */
  task: {
    type: Object,
    required: true,
  },
  last: {
    type: Boolean,
    default: false,
  },
});

const timelineNamespace = inject('namespace');

const namespace = `${timelineNamespace}/chats`;

const { points } = useTaskPoints({
  taskId: props.taskId,
  namespace,
});

</script>

<style lang="scss" scoped>

</style>
