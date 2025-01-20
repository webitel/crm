import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import StatusesAPI from '../api/statuses.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    description: '',
  },
};

const api = createApiStoreModule({
  state: {
    api: StatusesAPI,
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

const statuses = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default statuses;
