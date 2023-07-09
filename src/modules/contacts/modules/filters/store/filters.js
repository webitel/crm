import BaseFilterSchema
  from '@webitel/ui-sdk/src/modules/QueryFilters/classes/BaseFilterSchema';
import FiltersStoreModule from '../FiltersStoreModule';

const state = {
  page: new BaseFilterSchema({
    value: 1,
    defaultValue: 1,
  }),
  size: new BaseFilterSchema({
    value: 10,
    defaultValue: 10,
  }),
  q: new BaseFilterSchema(),
};

const filters = new FiltersStoreModule().getModule({ state });

export default filters;
