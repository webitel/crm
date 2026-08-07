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

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useTaskPoints } from '../../../../composables/useTaskPoints';
import { useChatsHistoryStore } from '../../stores/chatsHistoryStore';
import ChatEndedPointTimelineRow from './chat-ended-point-timeline-row.vue';
import ChatPointTimelineRow from './chat-point-timeline-row.vue';

interface Props {
	taskId: string;
	task: {
		closedAt?: string | number;
	};
	last?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	last: false,
});

const chatsHistoryStore = useChatsHistoryStore();
const { historyById } = storeToRefs(chatsHistoryStore);
const { loadHistory } = chatsHistoryStore;

const { points } = useTaskPoints({
	taskId: props.taskId,
	historyById,
	loadHistory,
});
</script>

<style lang="scss" scoped>

</style>
