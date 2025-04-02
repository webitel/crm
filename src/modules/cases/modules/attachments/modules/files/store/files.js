import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import FilesAPI from '../api/FilesAPI.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.cases.card.itemId,
};

const api = createApiStoreModule({
  state: {
    api: FilesAPI,
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

const files = createBaseStoreModule({
  modules: {
    table,
  },
});

export default files;
