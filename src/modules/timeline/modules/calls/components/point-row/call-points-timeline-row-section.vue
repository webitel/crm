<template>
  <div class="call-points-timeline-row-section">
    <call-point-timeline-row
      v-for="(point) of points"
      :key="point.id"
      :last="last"
      :point="point"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskPoints } from '../../../../composables/useTaskPoints';
import { useCallsHistoryStore } from '../../stores/callsHistoryStore';
import CallPointTimelineRow from './call-point-timeline-row.vue';

interface Props {
	taskId: string;
	last?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	last: false,
});

const { points } = useTaskPoints({
	taskId: props.taskId,
	useHistoryStore: useCallsHistoryStore,
});
</script>

<style scoped lang="scss">

</style>
