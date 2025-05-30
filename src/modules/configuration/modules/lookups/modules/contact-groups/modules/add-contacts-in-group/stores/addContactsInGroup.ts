import { createTableStore } from '@webitel/ui-datalist';
import { contacts as ContactsAPI } from '@webitel/ui-sdk/src/api/clients/сontacts/index';

import { AddContactsInGroupNamespace } from '../namespace';
import { headers } from './_internals/headers';

export const useAddContactsInGroupStore = createTableStore(
  AddContactsInGroupNamespace,
  {
    apiModule: ContactsAPI,
    headers,
    isAppendDataList: true,
  },
);
