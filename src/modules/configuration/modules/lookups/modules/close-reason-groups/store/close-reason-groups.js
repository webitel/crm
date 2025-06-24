import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import { CaseCloseReasonGroupsAPI } from '@webitel/api-services/api';

import closeReasons from '../modules/close-reasons/store/closeReasons.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    description: '',
  },
};

const api = createApiStoreModule({
  state: {
    api: CaseCloseReasonGroupsAPI,
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
    closeReasons,
  },
});

const closeReasonGroups = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default closeReasonGroups;
