import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import filters from '../modules/filters/store/filters';
import { headers } from './_internals/headers';

const resetCardState = {
  itemInstance: {
    name: '',
    code: '',
    sla: {},
    teams: [],
    skills: [],
    status: {},
    prefix: '',
    closeReasonGroup: {},
    description: '',
    services: [],
    state: true,
  },
};

const api = createApiStoreModule({
  state: {
    api: ServiceCatalogsAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: {
    itemInstance: resetCardState.itemInstance,
    _resettable: resetCardState,
  },
  modules: {
    api,
  },
});

const catalogs = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default catalogs;
