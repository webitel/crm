import {
	ContactsTimelineEventType,
	WebitelCasesCaseTimelineEventType,
} from '@webitel/api-services/gen';

export const TimelineEventType = {
	...ContactsTimelineEventType,
	...WebitelCasesCaseTimelineEventType,
} as const;

export type TimelineEventType =
	(typeof TimelineEventType)[keyof typeof TimelineEventType];
