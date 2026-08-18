import { ContactGroupsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { ContactGroupsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useContactGroupsDatalistStore = createTableStore(
	`${ContactGroupsNamespace}/datalist`,
	{
		apiModule: ContactGroupsAPI,
		headers,
	},
);
