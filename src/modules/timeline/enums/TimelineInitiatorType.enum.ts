export const TimelineInitiatorType = {
	Agent: 'agent',
	Contact: 'contact',
	Bot: 'bot',
	Flow: 'flow',
} as const;

export type TimelineInitiatorType =
	(typeof TimelineInitiatorType)[keyof typeof TimelineInitiatorType];
