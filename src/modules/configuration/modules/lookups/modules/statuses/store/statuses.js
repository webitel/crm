import { CaseStatusesAPI } from '@webitel/api-services/api';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import filters from '../modules/filters/store/filters';
import statusConditions from '../modules/status-conditions/store/status-conditions';
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
    api: CaseStatusesAPI,
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
    statusConditions,
  },
});

const statuses = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default statuses;
