<template>
  <div class="chat-points-row-section">
    <chat-point-timeline-row
      v-for="(point) of points"
      :key="point.id"
      :point="point"
    />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useTaskPoints } from '../../../../composables/useTaskPoints.js';
import ChatPointTimelineRow from './chat-point-timeline-row.vue';

const props = defineProps({
  taskId: {
    type: String,
    required: true,
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
