import { ChatMessagesHistoryAPI } from '@webitel/api-services/api';
import { TimelineMode } from '../../../enums/TimelineMode';

import { createTaskPointsHistoryStore } from '../../../stores/createTaskPointsHistoryStore';

const ModeApiMap = {
	[TimelineMode.Contact]: ChatMessagesHistoryAPI.getContactChatHistory,
	[TimelineMode.Case]: ChatMessagesHistoryAPI.getCaseChatHistory,
};

async function getList({ mode, parentId, taskId }) {
	const { items } = await ModeApiMap[mode]({
		parentId,
		taskId,
	});
	return {
		items: items.reverse(),
	};
}

export const useChatsHistoryStore = createTaskPointsHistoryStore(
	'timelineChatsHistory',
	{
		getList,
	},
);
