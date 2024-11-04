import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import SourcesAPI from '../modules/sources/api/SourcesAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const cardState = {
  itemInstance: {
    id: '',
    name: '',
    description: '',
    type: '',
  },
};

const tableGetters = {
  REQUIRED_FIELDS: () => ['mode'],
};

const api = createApiStoreModule({
  state: {
    api: SourcesAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  modules: {
    api,
    filters,
  },
  getters: tableGetters,
});

const card = createCardStoreModule({
  state: { _resettable: cardState },
  modules: {
    api
  },
});

const sources = createBaseStoreModule({
  getters: tableGetters,
  modules: {
    table,
    card,
  },
});

export default sources;
