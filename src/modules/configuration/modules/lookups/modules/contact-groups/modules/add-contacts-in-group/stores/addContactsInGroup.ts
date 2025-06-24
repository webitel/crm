import { ContactsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

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
