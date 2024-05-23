import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import { useRouter } from 'vue-router';

const router = useRouter();

const filters = new FiltersStoreModule()
.addFilter([
  {
    name: 'type',
    value: [WebitelContactsTimelineEventType.Call, WebitelContactsTimelineEventType.Chat],
    defaultValue: [WebitelContactsTimelineEventType.Call, WebitelContactsTimelineEventType.Chat],
    router,
    get: ['value', 'query'],
    set: ['value', 'query'],
    restore: ['query'],
  },
])
.getModule();

export default filters;
