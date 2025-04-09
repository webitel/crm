import { createTableStore } from '@webitel/ui-datalist';

import { CasesNamespace } from '../../../../cases/namespace';
import ContactCasesAPI from '../api/ContactCasesAPI.js';
import { headers } from '../store/_internals/headers';

export const useCasesStore = createTableStore(CasesNamespace, {
  apiModule: ContactCasesAPI,
  headers,
});
