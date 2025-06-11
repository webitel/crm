import { WebitelCasesCaseTimelineEventType, WebitelContactsTimelineEventType } from '@webitel/api-services/gen';

export const TimelineEventType = {
  ...WebitelContactsTimelineEventType,
  ...WebitelCasesCaseTimelineEventType,
} as const;

export type TimelineEventType =
  (typeof TimelineEventType)[keyof typeof TimelineEventType];
