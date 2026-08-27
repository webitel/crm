import { ContactsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { headers } from '../../_shared/store/_internals/headers';
import { ContactsNamespace } from '../../namespace';

export const useContactsDatalistStore = createTableStore(
	`${ContactsNamespace}/datalist`,
	{
		apiModule: ContactsAPI,
		headers,
	},
);
