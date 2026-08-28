import { ContactCasesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { ContactCasesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useContactCasesDatalistStore = createTableStore(
	ContactCasesNamespace,
	{
		apiModule: ContactCasesAPI,
		headers,
	},
);
