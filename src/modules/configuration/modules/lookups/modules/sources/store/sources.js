import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import SourcesAPI from '../api/sources.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const resetCardState = {
  itemInstance: {
    name: '',
    description: '',
    type: '',
  },
};

const api = createApiStoreModule({
  state: {
    api: SourcesAPI,
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
  state: { _resettable: resetCardState },
  modules: {
    api,
  },
});

const sources = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default sources;
