import type { ContactsTranscriptLookup } from '@webitel/api-services/gen/models';

import type { TimelineEventType } from '../enums/TimelineEventType';

export interface TimelineTask {
	id: string;
	type: TimelineEventType;
	createdAt: string;
	transcripts?: ContactsTranscriptLookup[];
}

export interface EmailTimelineTask extends TimelineTask {
	isInbound?: boolean;
}

export interface TimelineActionOption {
	id: string;
	text: string;
	icon: string;
	handler: () => void;
}

export interface TimelineTab {
	text: string;
	value: string;
}
