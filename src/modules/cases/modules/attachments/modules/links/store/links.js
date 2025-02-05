import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import LinskAPI from '../api/LinksAPI.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.cases.card.itemId,
};


const api = createApiStoreModule({
  state: {
    api: LinskAPI,
  },
});
const table = createTableStoreModule({
  state: {
    headers,
  },
  modules: {
    api,
    filters,
  },
  getters,
});

const links = createBaseStoreModule({
  modules: {
    table,
  },
});

export default links;
