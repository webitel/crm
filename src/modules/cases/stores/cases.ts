import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import CasesAPI from '../api/CasesAPI';
import { CasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useCasesStore = createTableStore(CasesNamespace, {
  apiModule: CasesAPI,
  headers,
});
