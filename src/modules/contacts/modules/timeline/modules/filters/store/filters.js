import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';

const filters = new FiltersStoreModule()
.addFilter([
  {
    name: 'type',
    value: [WebitelContactsTimelineEventType.Call, WebitelContactsTimelineEventType.Chat, WebitelContactsTimelineEventType.Email],
    defaultValue: [WebitelContactsTimelineEventType.Call, WebitelContactsTimelineEventType.Chat, WebitelContactsTimelineEventType.Email],
  },
])
.getModule();

export default filters;
