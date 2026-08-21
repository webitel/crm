/**
 * @name TimelineTaskKind
 * @description Enumerates kind of task, which is sub-category of task type, like chat, call, email, etc.
 */

export const TimelineTaskKind = {
	CallInbound: 'callInbound',
	CallOutbound: 'callOutbound',
	CallMissed: 'callMissed',

	ChatInbound: 'chatInbound',
	// ChatOutbound: 'chatOutbound',
	ChatEnded: 'chatEnded',

	EmailInbound: 'emailInbound',
	EmailOutbound: 'emailOutbound',
} as const;

export type TimelineTaskKind =
	(typeof TimelineTaskKind)[keyof typeof TimelineTaskKind];
