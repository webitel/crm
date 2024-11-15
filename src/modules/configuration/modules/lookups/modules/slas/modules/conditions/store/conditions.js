import {
  createApiStoreModule,
  createBaseStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import ConditionsAPI from '../api/conditions.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resettableItemState = {
  itemInstance: {
  },
};

const getters = {
  PARENT_ID: (s, g, rootState) => rootState.slas.itemId, ////перевірити шлях
};

const api = createApiStoreModule({
  state: {
    api: ConditionsAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  getters,
  modules: {
    api,
    filters,
  },
});

const conditions = createBaseStoreModule({
  modules: {
    table,
  },
});

export default conditions;
