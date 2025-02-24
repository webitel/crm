import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import CustomLookupApi from '../api/custom-lookups.js';
import filters from '../modules/filters/store/filters';

const resetTableState = {
  dataList: [],
  selected: [],
  error: {},
  isLoading: false,
  isNextPage: false,
};

const resetCardState = {
  repo: '',
};

const api = createApiStoreModule({
  state: {
    api: CustomLookupApi,
  },
});

const table = createTableStoreModule({
  state: { _resettable: resetTableState, headers: [], repo: null },
  modules: {
    filters,
    api,
  },
});

const getters = {
  LOOKUP_FIELDS: (state) => state.fields,
};

const card = createCardStoreModule({
  state: {
    fields: [],
    _resettable: resetCardState,
    repo: null,
    fieldsToSend: [],
  },
  getters,
  modules: {
    api,
  },
});

const customLookup = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default customLookup;
