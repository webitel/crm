import { CaseStatusConditionsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import { asPiniaStoreFactory } from '../../../../../../../../../../app/store/asPiniaStoreFactory';

import { CaseStatusConditionsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseStatusConditionsDatalistStore = asPiniaStoreFactory(
	createTableStore(`${CaseStatusConditionsNamespace}/datalist`, {
		apiModule: CaseStatusConditionsAPI,
		headers,
	}),
);
