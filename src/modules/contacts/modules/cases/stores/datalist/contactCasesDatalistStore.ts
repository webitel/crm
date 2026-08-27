import { createTableStore } from '@webitel/ui-datalist';

import ContactCasesAPI from '../../api/ContactCasesAPI';
import { ContactCasesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useContactCasesDatalistStore = createTableStore(
	ContactCasesNamespace,
	{
		apiModule: ContactCasesAPI,
		headers,
	},
);
