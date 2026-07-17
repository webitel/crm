import { CaseStatusesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import { asPiniaStoreFactory } from '../../../../../../../../app/store/asPiniaStoreFactory';

import { CaseStatusesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseStatusesDatalistStore = asPiniaStoreFactory(
	createTableStore(`${CaseStatusesNamespace}/datalist`, {
		apiModule: CaseStatusesAPI,
		headers,
	}),
);
