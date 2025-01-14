import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import PrioritiesAPI from '../api/priorities.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    description: '',
    color: '',
  },
};

const api = createApiStoreModule({
  state: {
    api: PrioritiesAPI,
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
  state: { _resettable: resetCardState, itemInstance: resetCardState.itemInstance },
  modules: {
    api,
  },
});

const priorities = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default priorities;
