import { CaseCloseReasonsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseCloseReasonsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseCloseReasonsDatalistStore = createTableStore(
	`${CaseCloseReasonsNamespace}/datalist`,
	{
		apiModule: CaseCloseReasonsAPI,
		headers,
	},
);
