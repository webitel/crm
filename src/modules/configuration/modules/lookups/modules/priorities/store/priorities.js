import { CasePrioritiesAPI } from '@webitel/api-services/api';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import filters from '../modules/filters/store/filters';
import headers from './_internals/headers';

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
    api: CasePrioritiesAPI,
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
  state: {
    _resettable: resetCardState,
    itemInstance: resetCardState.itemInstance,
  },
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
