import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import SlasAPI from '../api/slas.js';
import conditions from '../modules/conditions/store/conditions';
import filters from '../modules/filters/store/filters';
import headers from './_internals/headers';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    status: {},
    prefix: '',
    reasons: {},
    sla: {},
    team: {},
    code: '',
    skill: {},
    description: '',
    state: true,
  },
};

const api = createApiStoreModule({
  state: {
    api: SlasAPI,
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
    conditions,
  },
});

const slas = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default slas;
