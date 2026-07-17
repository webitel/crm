import { ContactsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import { asPiniaStoreFactory } from '../../../app/store/asPiniaStoreFactory';

import { headers } from '../../_shared/modules/contacts/store/_internals/headers';
import { ContactsNamespace } from '../namespace';

export const useContactsStore = asPiniaStoreFactory(
	createTableStore(ContactsNamespace, {
		apiModule: ContactsAPI,
		headers,
	}),
);
