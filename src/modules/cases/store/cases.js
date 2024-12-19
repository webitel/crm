import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CasesAPI from '../api/CasesAPI.js';
import service from '../modules/service/store/service.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resettableState = {
  itemInstance: {
    name: '',
    subject: '',
    priority: '',
    status: '',
    source: '',
    createdAt: '',
    service: '',
    about: '',
    createdBy: '',
    group: '',
    assignee: '',
    reporter: '',
    sla: '',
    slaCondition: '',
    plannedReactionAt: '',
    plannedResolutionAt: '',
    reactedAt: '',
    resolvedAt: '',
    closeReason: '',
    closeResult: '',
    rate: '',
    statusCondition: '',
  },
};

const state = {
  editMode: false,
};

const getters = {
  EDIT_MODE: (state) => state.editMode,
};

const actions = {
  TOGGLE_EDIT_MODE: (context, payload) => {
    context.commit('SET', {
      path: 'editMode',
      value: payload,
    });
  },
};

const api = createApiStoreModule({
  state: {
    api: CasesAPI,
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
});
const card = createCardStoreModule({
  state: {
    _resettable: resettableState,
    ...state,
  },
  modules: {
    api,
  },
  actions,
  getters,
});

const cases = createBaseStoreModule({
  modules: {
    table,
    card,
    service,
  },
});

export default cases;
