import BaseFilterSchema
  from '@webitel/ui-sdk/src/modules/Filters/classes/BaseFilterSchema';
import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import router from '../../../../../../../app/router';

const state = {
  type: new BaseFilterSchema({
    value: [],
    defaultValue: ['chat', 'call'], // FIXME use enum
  }),
};

const getters = {
  ROUTER: () => router,
  TABLE_NAMESPACE: () => '',
};

const actions = {
  LOAD_DATA_LIST: () => {},
};

const filters = new FiltersStoreModule().getModule({
  state,
  getters,
  actions,
});

export default filters;
