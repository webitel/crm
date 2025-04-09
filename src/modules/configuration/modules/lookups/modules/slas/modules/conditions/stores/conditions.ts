import { createTableStore } from '@webitel/ui-datalist';

import ConditionsAPI from '../api/conditions';
import { SLAConditionsNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useSLAConditionsStore = createTableStore(SLAConditionsNamespace, {
  apiModule: ConditionsAPI,
  headers,
});
