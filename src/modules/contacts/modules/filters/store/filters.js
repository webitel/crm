import BaseFilterSchema
  from '@webitel/ui-sdk/src/modules/Filters/classes/BaseFilterSchema';
import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import router from '../../../../../app/router';
import SearchMode from '../enums/SearchMode.enum';

const state = {
  page: new BaseFilterSchema({
    value: 1,
    defaultValue: 1,
  }),
  size: new BaseFilterSchema({
    value: 10,
    defaultValue: 10,
  }),
  sort: new BaseFilterSchema(),
  [SearchMode.NAME]: new BaseFilterSchema(),
  [SearchMode.LABELS]: new BaseFilterSchema(),
  [SearchMode.ABOUT]: new BaseFilterSchema(),
  [SearchMode.VARIABLES]: new BaseFilterSchema(),
};

const getters = {
  ROUTER: () => router,
  TABLE_NAMESPACE: () => 'contacts/table',
};

const filters = new FiltersStoreModule().getModule({ state, getters });

export default filters;
