import FiltersStoreModule from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';

import { TimelineEventType } from '../../../enums/TimelineEventType';

const filters = new FiltersStoreModule()
	.addFilter([
		{
			name: 'type',
			value: [
				TimelineEventType.Call,
				TimelineEventType.Chat,
				TimelineEventType.Email,
			],
			defaultValue: [
				TimelineEventType.Call,
				TimelineEventType.Chat,
				TimelineEventType.Email,
			],
			multiple: true,
		},
	])
	.getModule();

export default filters;
