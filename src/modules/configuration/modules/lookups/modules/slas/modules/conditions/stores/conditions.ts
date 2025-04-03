import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import ConditionsAPI from '../api/conditions';
import { SLAConditionsNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useSLAConditionsStore = createTableStore(SLAConditionsNamespace, {
  apiModule: ConditionsAPI,
  headers,
});
