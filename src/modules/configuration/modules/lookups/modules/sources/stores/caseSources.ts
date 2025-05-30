import { createTableStore } from '@webitel/ui-datalist';
import { createFormStore } from '@webitel/ui-datalist/form';
import { createSourceBody as formValidationSchema } from '@webitel/api-services/gen';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
} from '@webitel/ui-sdk/store'; // card compat

import CaseSourcesAPI from '../api/caseSources';
import { headers } from './_internals/headers';

export const useCaseSourcesDatalistStore = createTableStore(
  'crm/configuration/lookups/caseSources/datalist',
  {
    apiModule: CaseSourcesAPI,
    headers,
  },
);

export const useCaseSourcesFormStore = createFormStore({
  namespace: 'crm/configuration/lookups/caseSources/form',
  apiModule: CaseSourcesAPI,
  standardValidationSchema: formValidationSchema,
});

const resetCardState = {
  itemInstance: {
    name: '',
    description: '',
    type: '',
  },
};

const api = createApiStoreModule({
  state: {
    api: CaseSourcesAPI,
  },
});

const card = createCardStoreModule({
  state: { _resettable: resetCardState },
  modules: {
    api,
  },
});

const sources = createBaseStoreModule({
  modules: {
    card,
  },
});

export default sources;
