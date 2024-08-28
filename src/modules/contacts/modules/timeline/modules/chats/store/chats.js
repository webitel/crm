import TimelineTaskPointsModule
  from '../../../store/TimelineTaskPointsModule.js';
import MessageHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory.js';

const chats = new TimelineTaskPointsModule({
  apiModule: {
    getList: ({ taskId, parentId }) => MessageHistoryAPI.getList({
      contactId: parentId,
      chatId: taskId,
    }),
  },
})
.getModule();

export default chats;
