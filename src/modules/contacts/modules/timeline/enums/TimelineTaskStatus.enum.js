/**
Abstract Task Statuses are used,
because chat, task and email have different definitions of "start", "end", etc
 */

const TimelineTaskStatus = Object.freeze({
  STARTED: 'started',
  MISSED: 'missed',
  TRANSFERRED: 'transferred',
  ENDED: 'ended',
});

export default TimelineTaskStatus;
