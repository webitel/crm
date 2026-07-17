import { createTableStore } from '@webitel/ui-datalist';

import { asPiniaStoreFactory } from '../../../../../../../../../app/store/asPiniaStoreFactory';

import { headers } from '../../../../../../../../_shared/modules/contacts/store/_internals/headers';
import ContactGroupContactsAPI from '../api/ContactGroupContactsAPI';
import { ContactsGroupContactsNamespace } from '../namespace';

export const useContactsGroupContactsStore = asPiniaStoreFactory(
	createTableStore(ContactsGroupContactsNamespace, {
		apiModule: ContactGroupContactsAPI,
		headers,
	}),
);
