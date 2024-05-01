<template>
<div class="call-points-timeline-row-section">
  <call-point-timeline-row
    v-for="(point) of points"
    :key="point.id"
    :point="point"
  />
</div>
</template>

<script setup>
import { inject } from 'vue';
import { useTaskPoints } from '../../../../composables/useTaskPoints.js';
import CallPointTimelineRow from './call-point-timeline-row.vue';

const props = defineProps({
  taskId: {
    type: [String],
    required: true,
  },
});

const timelineNamespace = inject('namespace');

const namespace = `${timelineNamespace}/calls`;

const { points } = useTaskPoints({ namespace, taskId: props.taskId });
</script>

<style scoped lang="scss">

</style>
