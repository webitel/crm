import { createTableStore } from '@webitel/ui-datalist';

import { asPiniaStoreFactory } from '../../../app/store/asPiniaStoreFactory';

import CasesAPI from '../api/CasesAPI';
import { CasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useCasesStore = asPiniaStoreFactory(
	createTableStore(CasesNamespace, {
		apiModule: CasesAPI,
		headers,
	}),
);
