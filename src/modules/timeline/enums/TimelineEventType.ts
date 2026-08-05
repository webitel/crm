export const TimelineEventType = {
	Chat: 'chat',
	Call: 'call',
	Email: 'email',
} as const;

export type TimelineEventType =
	(typeof TimelineEventType)[keyof typeof TimelineEventType];
