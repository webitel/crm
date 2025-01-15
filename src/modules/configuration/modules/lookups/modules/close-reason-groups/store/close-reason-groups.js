import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CloseReasonGroupsAPI from '../api/closeReasonGroups.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters.js';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    description: '',
  },
};

const api = createApiStoreModule({
  state: {
    api: CloseReasonGroupsAPI,
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
    // closeReasons,
  },
});

const closeReasonGroups = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default closeReasonGroups;
