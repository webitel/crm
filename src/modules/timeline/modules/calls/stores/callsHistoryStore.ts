import { CallHistoryAPI } from '@webitel/api-services/api';

import { createTaskPointsHistoryStore } from '../../../stores/createTaskPointsHistoryStore';

async function getList({ taskId }: { taskId: string }) {
	const { items } = await CallHistoryAPI.getListPost({
		data: {
			dependencyId: taskId,
			hasTransfer: true,
			timeline: true,
			fields: [
				'id',
				'to',
				'duration',
				'created_at',
			],
		},
	});
	return {
		items: items.reverse(),
	};
}

export const useCallsHistoryStore = createTaskPointsHistoryStore(
	'timelineCallsHistory',
	{
		getList,
	},
);
