/**
 * @name TimelinePinType
 * @description Enumerates (ONLY!) the types of timeline pins.
 */

export const TimelinePinType = {
	// close expanded
	Close: 'close',

	// day pin
	Day: 'day',

	// reusable icon pins for points inside tasks
	User: 'contact',
	Agent: 'agent',
	Bot: 'bot',

	// chat-related pins
	ChatInbound: 'chatInbound',
	ChatTransfer: 'chatTransfer',
	ChatEnd: 'chatEnd',

	// call-related pins
	CallInbound: 'callInbound',
	CallOutbound: 'callOutbound',
	CallMissed: 'callMissed',
	CallInboundOnIvr: 'callInboundOnIvr',
	CallTransfer: 'callTransfer',

	// email-related pins
	EmailInbound: 'emailInbound',
	EmailOutbound: 'emailOutbound',
} as const;

export type TimelinePinType =
	(typeof TimelinePinType)[keyof typeof TimelinePinType];
