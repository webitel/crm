import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CatalogsAPI from '../api/service-catalogs.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const resettableState = {
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
    api: CatalogsAPI,
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
  state: { _resettable: resettableState },
  modules: {
    api,
  },
});

const serviceCatalogs = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default serviceCatalogs;
