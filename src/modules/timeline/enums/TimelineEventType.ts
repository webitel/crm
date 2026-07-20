// ContactsTimelineEventType is missing from the types barrel of '@webitel/api-services/gen'

import { WebitelCasesCaseTimelineEventType } from '@webitel/api-services/gen';
import { ContactsTimelineEventType } from '@webitel/api-services/gen/models';

export const TimelineEventType = {
	...ContactsTimelineEventType,
	...WebitelCasesCaseTimelineEventType,
} as const;

export type TimelineEventType =
	(typeof TimelineEventType)[keyof typeof TimelineEventType];
