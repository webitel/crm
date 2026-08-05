import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import type { createTaskPointsHistoryStore } from '../stores/createTaskPointsHistoryStore';

type HistoryStore = ReturnType<ReturnType<typeof createTaskPointsHistoryStore>>;

export const useTaskPoints = ({
	taskId,
	useHistoryStore,
}: {
	taskId: string;
	useHistoryStore: () => HistoryStore;
}) => {
	const historyStore = useHistoryStore();
	const { historyById } = storeToRefs(historyStore);
	const { loadHistory } = historyById;

	const points = computed(() => historyById.value[taskId]);

	if (!points.value) {
		loadHistory(taskId);
	}

	return {
		points,
	};
};
