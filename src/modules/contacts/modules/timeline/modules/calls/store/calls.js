import TimelineTaskPointsModule
  from '../../../store/TimelineTaskPointsModule.js';
import HistoryAPI from '../api/HistoryAPI.js';

const calls = new TimelineTaskPointsModule({ apiModule: HistoryAPI })
.getModule();

export default calls;
