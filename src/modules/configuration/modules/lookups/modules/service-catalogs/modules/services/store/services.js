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
};

const resetCardState = {
  itemId: '',
  rootId: '',
  catalogId: '',
  itemInstance: {
    name: '',
    code: '',
    state: true,
    description: '',
    assignee: {},
    sla: {},
    group: {},
  },
};

const actions = {
  SELECT_ROOT: async ({ commit }, { rootId }) => {
    commit('SET', { path: 'rootId', value: rootId });
  },
  SELECT_CATALOG: async ({ commit }, { catalogId }) => {
    commit('SET', { path: 'catalogId', value: catalogId });
  },
}

const api = createApiStoreModule({
  state: {
    api: ServicesAPI,
  },
});

const table = createTableStoreModule({
  state: { _resettable: resetTableState, headers, rootId: null },
  actions,
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: { _resettable: resetCardState, rootId: null },
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
