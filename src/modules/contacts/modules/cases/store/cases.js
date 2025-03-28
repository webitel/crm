import {
  createApiStoreModule,
  createBaseStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import ContactCasesAPI from '../api/ContactCasesAPI.js';
import { headers } from './_internals/headers';

const api = createApiStoreModule({
  state: {
    api: ContactCasesAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  modules: {
    api,
  },
});

const cases = createBaseStoreModule({
  modules: {
    table,
  },
});

export default cases;
