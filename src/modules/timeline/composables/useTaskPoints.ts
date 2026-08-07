import { computed } from 'vue';
import type { Ref } from 'vue';

import type { TaskPoint } from '../stores/createTaskPointsHistoryStore';

export const useTaskPoints = ({
	taskId,
	historyById,
	loadHistory,
}: {
	taskId: string;
	historyById: Ref<Record<string, TaskPoint[]>>;
	loadHistory: (taskId: string) => Promise<void>;
}) => {
	const points = computed(() => historyById.value[taskId]);

	if (!points.value) {
		loadHistory(taskId);
	}

	return {
		points,
	};
};
