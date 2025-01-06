import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import ServicesAPI from '../api/services.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const resetTableState = {
  dataList: [],
  selected: [],
  error: {},
  isLoading: false,
  isNextPage: false,
  rootId: null,
};

const resetCardState = {
  itemId: '',
  rootId: null,
  itemInstance: {
    name: '',
    code: '',
    state: true,
    description: '',
  },
};

const actions = {
  SELECT_ROOT: async ({ commit }, { rootId }) => {
    commit('SET', { path: 'rootId', value: rootId });
  },
}

const api = createApiStoreModule({
  state: {
    api: ServicesAPI,
  },
});

const table = createTableStoreModule({
  state: { _resettable: resetTableState, headers },
  actions,
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: { _resettable: resetCardState },
  actions,
  modules: {
    api,
  },
});

const services = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default services;
