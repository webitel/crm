import { CaseStatusConditionsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseStatusConditionsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseStatusConditionsDatalistStore = createTableStore(
	`crm/${CaseStatusConditionsNamespace}/datalist`,
	{
		apiModule: CaseStatusConditionsAPI,
		headers,
	},
);
