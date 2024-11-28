import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import CasesAPI from '../api/CasesAPI.js';
import caseService from '../modules/case-service/store/case-service.js';
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
    plannedReactionAt: '',
    plannedResolutionAt: '',
    reactedAt: '',
    resolvedAt: '',
    closeReason: '',
    closeResult: '',
    rate: '',
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
  },
  modules: {
    api,
  },
});

const cases = createBaseStoreModule({
  modules: {
    table,
    card,
    caseService,
  },
});

export default cases;
