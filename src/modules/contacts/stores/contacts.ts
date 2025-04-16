import { createTableStore } from '@webitel/ui-datalist';

import ContactsApi from '../api/ContactsAPI';
import { ContactsNamespace } from '../namespace';
import headers from '../store/_internals/headers';

export const useContactsStore = createTableStore(ContactsNamespace, {
  apiModule: ContactsApi,
  headers,
});
