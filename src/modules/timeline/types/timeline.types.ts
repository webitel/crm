import type { WebitelContactsTranscriptLookup } from 'webitel-sdk';

import type { TimelineEventType } from '../enums/TimelineEventType';

export interface TimelineTask {
	id: string;
	type: TimelineEventType;
	createdAt: string;
	transcripts?: WebitelContactsTranscriptLookup[];
}

export interface TimelineVariable {
	key: string;
	value: string;
}

export interface TimelinePostprocessingEntry {
	agent?: {
		id: string;
		name: string;
	};
	form: Record<string, unknown>;
	reportingAt?: number;
}

export interface TimelineInfo {
	variables?: TimelineVariable[];
	postprocessing?: TimelinePostprocessingEntry[];
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
