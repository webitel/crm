import { createTableStore } from '@webitel/ui-datalist';

import { asPiniaStoreFactory } from '../../../../../../../../../app/store/asPiniaStoreFactory';

import ConditionsAPI from '../api/conditions';
import { SLAConditionsNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useSLAConditionsStore = asPiniaStoreFactory(
	createTableStore(SLAConditionsNamespace, {
		apiModule: ConditionsAPI,
		headers,
	}),
);
