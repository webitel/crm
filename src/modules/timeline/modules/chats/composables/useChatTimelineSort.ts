import { UserSettingsAPI } from '@webitel/api-services/api';
import { ref } from 'vue';

const SETTINGS_KEY = 'crm-timeline-chat-sort';

const newestFirst = ref(true);
let loaded = false;
let toggled = false;

export function useChatTimelineSort() {
	async function load() {
		if (loaded) return;
		loaded = true;
		try {
			const data = await UserSettingsAPI.get({
				key: SETTINGS_KEY,
			});
			if (!toggled && (data?.order === 'asc' || data?.order === 'desc')) {
				newestFirst.value = data.order === 'desc';
			}
		} catch {}
	}

	function toggleSort() {
		toggled = true;
		newestFirst.value = !newestFirst.value;
		return UserSettingsAPI.set({
			key: SETTINGS_KEY,
			value: {
				order: newestFirst.value ? 'desc' : 'asc',
			},
		});
	}

	return {
		newestFirst,
		load,
		toggleSort,
	};
}
