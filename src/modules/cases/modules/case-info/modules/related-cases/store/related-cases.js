import {
  createApiStoreModule,
  createBaseStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import relatedCasesAPI from '../api/related-cases-api.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.cases.card.itemId,
};

const api = createApiStoreModule({
  state: {
    api: relatedCasesAPI,
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

const relatedCases = createBaseStoreModule({
  modules: {
    table,
  },
});

export default relatedCases;
