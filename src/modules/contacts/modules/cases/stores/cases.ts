import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import { CasesNamespace } from '../../../../cases/namespace';
import ContactCasesAPI from '../api/ContactCasesAPI.js';
import { headers } from '../store/_internals/headers';

export const useCasesStore = createTableStore(CasesNamespace, {
  apiModule: ContactCasesAPI,
  headers,
});
