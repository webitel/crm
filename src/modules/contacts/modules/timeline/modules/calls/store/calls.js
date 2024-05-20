import TimelineTaskPointsModule
  from '../../../store/TimelineTaskPointsModule.js';
import HistoryAPI from '../api/HistoryAPI.js';

const calls = new TimelineTaskPointsModule({
  apiModule: {
    getList: ({ taskId }) => HistoryAPI.getList({ dependencyId: taskId, hasTransfer: true }),
  },
})
.getModule();

export default calls;
