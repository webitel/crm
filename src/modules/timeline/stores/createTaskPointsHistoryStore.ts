import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useTimelineStore } from './timeline';

export interface TaskPoint {
	id: string;
	[key: string]: unknown;
}

interface TaskPointsApiModule {
	getList: (params: {
		mode: unknown;
		parentId: unknown;
		taskId: string;
	}) => Promise<{
		items: TaskPoint[];
	}>;
}

export function createTaskPointsHistoryStore(
	id: string,
	apiModule: TaskPointsApiModule,
) {
	return defineStore(id, () => {
		const historyById = ref<Record<string, TaskPoint[]>>({});

		async function loadHistory(taskId: string) {
			const timelineStore = useTimelineStore();
			const { items } = await apiModule.getList({
				mode: timelineStore.mode,
				parentId: timelineStore.parentId,
				taskId,
			});
			historyById.value[taskId] = items;
		}

		return {
			historyById,
			loadHistory,
		};
	});
}
