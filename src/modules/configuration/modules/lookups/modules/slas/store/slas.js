import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import SlasAPI from '../api/slas.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';
import conditions from '../modules/conditions/store/conditions';

const resettableState = {
  itemInstance: {
  },
};

const api = createApiStoreModule({
  state: {
    api: SlasAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: { _resettable: resettableState },
  modules: {
    api,
    conditions,
  },
});

const slas = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default slas;
