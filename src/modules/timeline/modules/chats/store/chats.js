import TimelineTaskPointsModule from '../../../store/TimelineTaskPointsModule.js';
import MessageHistoryAPI from '../api/MessageHistoryAPI.js';

const chats = new TimelineTaskPointsModule({
  apiModule: MessageHistoryAPI,
}).getModule();

export default chats;
