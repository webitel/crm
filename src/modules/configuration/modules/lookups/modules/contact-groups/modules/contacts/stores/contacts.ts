import { createTableStore } from '@webitel/ui-datalist';

import { headers } from '../../../../../../../../_shared/modules/contacts/store/_internals/headers';
import ContactGroupContactsAPI from '../api/contactGroupContactsAPI';
import { ContactsGroupContactsNamespace } from '../namespace';

export const useContactsGroupContactsStore = createTableStore(
  ContactsGroupContactsNamespace,
  {
    apiModule: ContactGroupContactsAPI,
    headers,
  },
);
