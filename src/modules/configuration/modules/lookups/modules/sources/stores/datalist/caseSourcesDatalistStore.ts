import { createTableStore } from '@webitel/ui-datalist';

import CaseSourcesAPI from "../../api/caseSources";
import { headers } from './_internals/headers';

export const useCaseSourcesDatalistStore = createTableStore(
  'crm/configuration/lookups/caseSources/datalist',
  {
    apiModule: CaseSourcesAPI,
    headers,
  },
);
