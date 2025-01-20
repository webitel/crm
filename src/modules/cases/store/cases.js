import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CasesAPI from '../api/CasesAPI.js';
import comments from '../modules/case-info/modules/comments/store/comments.js';
import service from '../modules/service/store/service.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resetCardState = {
  itemInstance: {
    id:'',
    name: '',
    assignee: {},
    author: {},
    close: {
      closeReason: {},
      closeResult: '',
    },
    closeReasonGroup: {},
    comments: {},
    contactInfo: '',
    createdAt: '',
    createdBy: '',
    description: '',
    group: {},
    impacted: {},
    links: {},
    plannedReactionAt: '',
    plannedResolutionAt: '',
    priority: {},
    rate: {
      rating: '',
      ratingComment: '',
    },
    reporter: {},
    service: {},
    sla: {},
    slaCondition: {},
    source: {},
    status: {},
    statusCondition: {},
    subject: '',
    timing: {},
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
    _resettable: resetCardState,
    itemInstance: resetCardState.itemInstance,
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
    comments,
  },
});

export default cases;
