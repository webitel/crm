import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import ConditionsAPI from '../api/conditions';
import { headers } from '../store/_internals/headers.ts';

export const useSLAConditionsStore = (namespace: string) =>
  createTableStore(namespace, {
    apiModule: ConditionsAPI,
    headers,
  })();
