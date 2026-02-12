import { createTableStore } from '@webitel/ui-datalist';

import ContactCasesAPI from '../api/ContactCasesAPI';
import { ContactCasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useContactCasesStore = createTableStore(ContactCasesNamespace, {
	apiModule: ContactCasesAPI,
	headers,
});
