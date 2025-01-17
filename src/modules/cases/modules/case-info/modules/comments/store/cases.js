import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CasesAPI from '../api/CasesAPI.js';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers.js';

const resettableState = {
  itemInstance: {
    id:'',
    name: '',
    subject: '',
    priority: '',
    status: '',
    source: {
      id: '',
      name: '',
      type: '',
    },
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
    statusCondition: {},
    contactInfo: '',
    closeReasonGroup: '',
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

const cases = createBaseStoreModule({
  modules: {
    table,
  },
});

export default cases;
