import { createTableStore } from '@webitel/ui-datalist';
import { createFormStore } from '@webitel/ui-datalist/form';
import { z as zod } from 'zod';
import zodUaLocales from 'zod/locales/ua';
import { createSourceBody as formValidationSchema } from '@webitel/api-services/gen';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
} from '@webitel/ui-sdk/store'; // card compat

zod.config(zodUaLocales());

import CaseSourcesAPI from '../api/caseSources';
import { headers } from './_internals/headers';
// import { createSourceBodyTypeDefault } from '@webitel/api-services/src/gen/sources/sources.zod.gen';

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
  validationSchemaOptions: {
    syncState: {
      onValidate: true,
    },
  },
  standardValidationSchema: zod.object({
    description: zod
      .string().default('1213')
      .describe('The description of the source.'),
    name: zod.string().min(10).describe('The name of the source.'),
    type: zod
      .enum([
        'TYPE_UNSPECIFIED',
        'CALL',
        'CHAT',
        'SOCIAL_MEDIA',
        'EMAIL',
        'API',
        'MANUAL',
      ])
      .default('TYPE_UNSPECIFIED')
      .describe(
        'Represents a source type for the source entity.\n\n - TYPE_UNSPECIFIED: Unspecified source type.\n - CALL: Phone call source type.\n - CHAT: Chat source type.\n - SOCIAL_MEDIA: Social media source type.\n - EMAIL: Email source type.\n - API: API source type.\n - MANUAL: Manual source type.',
      ),
  }),
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
