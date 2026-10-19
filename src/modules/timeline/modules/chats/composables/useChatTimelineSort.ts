import { UserSettingsAPI } from '@webitel/api-services/api';
import { reactive } from 'vue';

const SETTINGS_KEY = 'crm-timeline-chat-sort';

const orders = reactive<Record<string, 'asc'>>({});
let loaded = false;

export function useChatTimelineSort() {
	function isNewestFirst(taskId: string | number) {
		return orders[String(taskId)] !== 'asc';
	}

	async function load() {
		if (loaded) return;
		loaded = true;
		try {
			const data = await UserSettingsAPI.get({
				key: SETTINGS_KEY,
			});
			const saved = data?.orders;
			if (!saved || typeof saved !== 'object') return;
			for (const [taskId, order] of Object.entries(saved)) {
				if (order === 'asc') orders[taskId] = 'asc';
			}
		} catch {}
	}

	function toggleSort(taskId: string | number) {
		const key = String(taskId);
		if (orders[key] === 'asc') delete orders[key];
		else orders[key] = 'asc';
		return UserSettingsAPI.set({
			key: SETTINGS_KEY,
			value: {
				orders: {
					...orders,
				},
			},
		});
	}

	return {
		isNewestFirst,
		load,
		toggleSort,
	};
}
