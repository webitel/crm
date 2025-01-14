import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CatalogsAPI from '../api/service-catalogs.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const resetCardState = {
  itemInstance: {
    name: '',
    code: '',
    sla: {},
    teams: [],
    skills: [],
    status: {},
    prefix: '',
    closeReason: {},
    description: '',
    services: [],
    state: true,
  },
};

const api = createApiStoreModule({
  state: {
    api: CatalogsAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers
  },
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

const catalogs = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default catalogs;
