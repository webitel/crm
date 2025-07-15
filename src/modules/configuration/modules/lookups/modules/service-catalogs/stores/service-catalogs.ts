import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { ServiceCatalogsNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useServiceCatalogsStore = createTableStore(
  ServiceCatalogsNamespace,
  {
    apiModule: ServiceCatalogsAPI,
    headers,
  },
);
