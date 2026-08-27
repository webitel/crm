import { createTableStore } from '@webitel/ui-datalist';

import { headers } from '../../../../../../../../../contacts/_shared/store/_internals/headers';
import ContactGroupContactsAPI from '../../api/ContactGroupContactsAPI';
import { ContactsGroupContactsNamespace } from '../../namespace';

export const useContactGroupContactsDatalistStore = createTableStore(
	`${ContactsGroupContactsNamespace}/datalist`,
	{
		apiModule: ContactGroupContactsAPI,
		headers,
	},
);
