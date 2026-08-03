import { VariablesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { ContactsNamespace } from '../../../../namespace';
import { headers } from './_internals/headers';

export const useVariablesDatalistStore = createTableStore(
	`${ContactsNamespace}/variables/datalist`,
	{
		apiModule: VariablesAPI,
		headers,
	},
);
