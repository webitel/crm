import { createTableStore } from '@webitel/ui-datalist';

import ContactCasesAPI from '../api/ContactCasesAPI.js';
import { headers } from '../store/_internals/headers';

export const useContactCasesStore = (namespace) =>
  createTableStore(namespace, {
    apiModule: ContactCasesAPI,
    headers,
  });
