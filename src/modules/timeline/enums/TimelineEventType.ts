import { CasesCaseTimelineEventType,WebitelContactsTimelineEventType } from "webitel-sdk";

export const TimelineEventType = {
    ...WebitelContactsTimelineEventType,
    ...CasesCaseTimelineEventType,
} as const;

export type TimelineEventType = typeof TimelineEventType[keyof typeof TimelineEventType];
