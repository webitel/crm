import BaseFilterSchema
  from '@webitel/ui-sdk/src/modules/Filters/classes/BaseFilterSchema';
import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import router from '../../../../../../../app/router';

const state = {
  type: new BaseFilterSchema({
    value: [WebitelContactsTimelineEventType.Call, WebitelContactsTimelineEventType.Chat],
    defaultValue: [WebitelContactsTimelineEventType.Call, WebitelContactsTimelineEventType.Chat],
  }),
  page: {}, // FIXME WTF
};

const getters = {
  ROUTER: () => router,
  // fixing filters module wrong design decisions :(
  TABLE_NAMESPACE: () => '',
};

const actions = {
  // fixing filters module wrong design decisions :(
  LOAD_DATA_LIST: (context) => context.dispatch('contacts/card/timeline/INITIALIZE_LIST', null, { root: true }),
};

const filters = new FiltersStoreModule().getModule({
  state,
  getters,
  actions,
});

export default filters;
