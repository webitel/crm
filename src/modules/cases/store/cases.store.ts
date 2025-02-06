import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import { namespace } from '../namespace.ts';
import CasesAPI from '../api/CasesAPI.js';
import { headersStore } from './_internals/headers.store.ts';

export const useTableStore = createTableStore(namespace, {
    apiModule:CasesAPI,
    headers: headersStore,
});
