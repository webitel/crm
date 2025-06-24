import { createTableStore } from '@webitel/ui-datalist';
import { ContactsAPI } from '@webitel/api-services/api';

import { AddContactsInGroupNamespace } from '../namespace';
import { headers } from './_internals/headers';

export const useAddContactsInGroupStore = createTableStore(
  AddContactsInGroupNamespace,
  {
    apiModule: ContactsAPI,
    headers,
    isAppendDataList: true,
    disablePersistence: true,
  },
);
