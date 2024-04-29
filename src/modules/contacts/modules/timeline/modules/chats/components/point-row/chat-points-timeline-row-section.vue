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
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import ChatPointTimelineRow from './chat-point-timeline-row.vue';

const props = defineProps({
  taskId: {
    type: String,
    required: true,
  },
});

const timelineNamespace = inject('namespace');

const namespace = `${timelineNamespace}/chats`;

const store = useStore();

const points = computed(() => {
  return store.getters[`${namespace}/GET_HISTORY_BY_ID`](props.taskId);
});

function loadHistory() {
  store.dispatch(`${namespace}/LOAD_HISTORY`, { taskId: props.taskId });
}

if (!points.value) {
  loadHistory();
}

</script>

<style lang="scss" scoped>

</style>
