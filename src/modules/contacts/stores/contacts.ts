import { createTableStore } from '@webitel/ui-datalist';
import { ContactsAPI } from '@webitel/api-services/api';

import { headers } from '../../_shared/modules/contacts/store/_internals/headers';
import { ContactsNamespace } from '../namespace';

export const useContactsStore = createTableStore(ContactsNamespace, {
  apiModule: ContactsAPI,
  headers,
});
