import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import { baseCasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const createNewCasesStore = (namespace, {}) => {
  const useCasesStore = createTableStore(CasesNamespace, {
    apiModule: CasesAPI,
    headers,
  });

  return { useCasesStore };
};
