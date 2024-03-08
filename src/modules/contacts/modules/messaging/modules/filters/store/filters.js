import BaseFilterSchema
  from '@webitel/ui-sdk/src/modules/Filters/classes/BaseFilterSchema';
import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import router from '../../../../../../../app/router';

const state = {
  page: new BaseFilterSchema({
    value: 1,
    defaultValue: 1,
  }),
  size: new BaseFilterSchema({
    value: 1000,
    defaultValue: 1000,
  }),
  sort: new BaseFilterSchema(),
};

const getters = {
  ROUTER: () => router,
  TABLE_NAMESPACE: () => 'contacts/card/messaging/table',
};

const filters = new FiltersStoreModule().getModule({ state, getters });

export default filters;
