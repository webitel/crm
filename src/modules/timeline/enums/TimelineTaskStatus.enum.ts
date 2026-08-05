/**
 * Abstract Task Statuses are used,
 * because chat, task and email have different definitions of "start", "end", etc
 */

export const TimelineTaskStatus = {
	Started: 'started',
	Missed: 'missed',
	Transferred: 'transferred',
	Ended: 'ended',
	Sent: 'sent',
	Received: 'received',
} as const;

export type TimelineTaskStatus =
	(typeof TimelineTaskStatus)[keyof typeof TimelineTaskStatus];
