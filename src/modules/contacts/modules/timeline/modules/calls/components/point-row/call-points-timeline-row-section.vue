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
import { useStore } from 'vuex';
import CallPointTimelineRow from './call-point-timeline-row.vue';

const props = defineProps({
  taskId: {
    type: [String],
    required: true,
  },
});

const timelineNamespace = inject('namespace');

const namespace = `${timelineNamespace}/calls`;

const store = useStore();

const points = computed(() => {
  return store.getters[`${namespace}/HISTORY_BY_CALL_ID`](props.taskId);
});

function loadHistory() {
  store.dispatch(`${namespace}/LOAD_HISTORY`, { taskId: props.taskId });
}

if (!points.value) {
  loadHistory();
}

</script>

<style scoped lang="scss">

</style>
