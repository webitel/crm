import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import ContactCasesAPI from '../api/ContactCasesAPI.js';
import { ContactCasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useCasesStore = createTableStore(ContactCasesNamespace, {
  apiModule: ContactCasesAPI,
  headers,
});
