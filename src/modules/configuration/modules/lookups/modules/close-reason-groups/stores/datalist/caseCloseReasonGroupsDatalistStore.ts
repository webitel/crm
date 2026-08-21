import { CaseCloseReasonGroupsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseCloseReasonGroupsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseCloseReasonGroupsDatalistStore = createTableStore(
	`${CaseCloseReasonGroupsNamespace}/datalist`,
	{
		apiModule: CaseCloseReasonGroupsAPI,
		headers,
	},
);
