import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store.ts';

import ContactsAPI from '../api/ContactsAPI';
import { ContactsNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useContactsStore = createTableStore(ContactsNamespace, {
  apiModule: ContactsAPI,
  headers,
});
