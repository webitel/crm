import TimelineTaskPointsModule
  from '../../../store/TimelineTaskPointsModule.js';
import MessageHistoryAPI from '../api/MessageHistoryAPI.js';

const chats = new TimelineTaskPointsModule({
  apiModule: {
    getList: ({ taskId, parentId }) => MessageHistoryAPI.getList({
      taskId,
      parentId,
    }),
  },
})
.getModule();

export default chats;
