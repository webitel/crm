import {
  WebitelCasesCaseTimelineEventType,
  WebitelContactsTimelineEventType,
} from 'webitel-sdk';

export const TimelineEventType = {
  ...WebitelContactsTimelineEventType,
  ...WebitelCasesCaseTimelineEventType,
} as const;

export type TimelineEventType =
  (typeof TimelineEventType)[keyof typeof TimelineEventType];
