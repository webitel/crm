import {
  createApiStoreModule,
  createBaseStoreModule,
  createTableStoreModule,
  createCardStoreModule,
} from '@webitel/ui-sdk/store';
import CloseReasonsAPI from '../api/closeReasons.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resetCardState = {
  itemId: '',
  itemInstance: {},
};

const getters = {
  PARENT_ID: (s, g, rootState) => rootState.configuration.lookups.closeReasonGroups.card.itemId,
};

const actions = {
  ADD_ITEM: async (context) => {
    await context.dispatch('api/POST_ITEM', { context });
  },
  UPDATE_ITEM: async (context) => {
    await context.dispatch('api/UPD_ITEM', { context });
  },
}

const api = createApiStoreModule({
  state: {
    api: CloseReasonsAPI,
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
  state: { _resettable: resetCardState },
  getters,
  actions,
  modules: {
    api,
  },
});

const closeReasons = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default closeReasons;
