import { createTableStore } from '@webitel/ui-datalist';

import { headers } from '../../_shared/modules/contacts/store/_internals/headers';
import ContactsAPI from '../api/ContactsAPI';
import { ContactsNamespace } from '../namespace';

export const useContactsStore = createTableStore(ContactsNamespace, {
  apiModule: ContactsAPI,
  headers,
});
