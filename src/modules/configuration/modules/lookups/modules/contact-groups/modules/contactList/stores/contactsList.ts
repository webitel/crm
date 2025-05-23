import { createTableStore } from '@webitel/ui-datalist';

import ContactListAPI from '../api/ContactListAPI';
import { ContactsListNamespace } from '../namespace';
import { headers } from './_internals/headers';

export const useContactsListStore = createTableStore(ContactsListNamespace, {
  apiModule: ContactListAPI,
  headers,
  filterMode: 'static',
});
