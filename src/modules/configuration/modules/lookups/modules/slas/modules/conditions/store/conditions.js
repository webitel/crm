import {
  createApiStoreModule,
  createBaseStoreModule,
  createTableStoreModule,
  createCardStoreModule,
} from '@webitel/ui-sdk/store';
import ConditionsAPI from '../api/conditions.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resettableItemState = {
  itemInstance: {
  },
};

const getters = {
  PARENT_ID: (s, g, rootState) => rootState.configuration.lookups.slas.card.itemId,
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

const card = createCardStoreModule({
  state: { _resettable: resettableItemState },
  getters,
  modules: {
    api,
  },
});

const conditions = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default conditions;
