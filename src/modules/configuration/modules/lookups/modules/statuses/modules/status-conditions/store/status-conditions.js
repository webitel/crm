import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import StatusConditionsAPI from '../api/status-conditions.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    description: '',
  },
};

const getters = {
  PARENT_ID: (s, g, rootState) =>
    rootState.configuration.lookups.statuses.card.itemId,
};

const api = createApiStoreModule({
  state: {
    api: StatusConditionsAPI,
  },
});

const table = createTableStoreModule({
  state: { headers },
  getters,
  modules: {
    api,
    filters,
  },
});

const card = createCardStoreModule({
  state: {
    _resettable: resetCardState,
    itemInstance: resetCardState.itemInstance,
  },
  getters,
  modules: {
    api,
  },
});

const statusConditions = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default statusConditions;
