import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import CustomLookupsApi from '../api/custom-lookups.js';
import filters from '../modules/filters/store/filters';
import headers from './_internals/headers';

const resetCardState = {
  itemId: '',
  itemInstance: {},
};

const api = createApiStoreModule({
  state: {
    api: CustomLookupsApi,
  },
});

const table = createTableStoreModule({
  state: { headers },
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

const customLookups = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default customLookups;
