import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import SlasAPI from '../api/slas.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';
import conditions from '../modules/conditions/store/conditions';

const resetTableState = {
  dataList: [],
  selected: [],
  error: {},
  isLoading: false,
  isNextPage: false,
};

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    description: '',
    calendar: {},
    reactionTime: 0,
    resolutionTime: 0,
    validTo: 0,
    validFrom: 0,
  },
};

const api = createApiStoreModule({
  state: {
    api: SlasAPI,
  },
});

const table = createTableStoreModule({
  state: { _resettable: resetTableState, headers },
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: { _resettable: resetCardState },
  modules: {
    api,
    conditions,
  },
});

const slas = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default slas;
