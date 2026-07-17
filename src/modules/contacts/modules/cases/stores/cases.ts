import { createTableStore } from '@webitel/ui-datalist';

import { asPiniaStoreFactory } from '../../../../../app/store/asPiniaStoreFactory';

import ContactCasesAPI from '../api/ContactCasesAPI';
import { ContactCasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useContactCasesStore = asPiniaStoreFactory(
	createTableStore(ContactCasesNamespace, {
		apiModule: ContactCasesAPI,
		headers,
	}),
);
