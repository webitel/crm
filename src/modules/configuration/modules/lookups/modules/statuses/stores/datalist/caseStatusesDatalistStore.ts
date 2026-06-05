import { CaseStatusesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseStatusesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseStatusesDatalistStore = createTableStore(
	`${CaseStatusesNamespace}/datalist`,
	{
		apiModule: CaseStatusesAPI,
		headers,
	},
);
