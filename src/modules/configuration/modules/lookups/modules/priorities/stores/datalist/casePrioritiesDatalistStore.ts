import { CasePrioritiesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import { CasePrioritiesNamespace } from '../../namespace';

import { headers } from './_internals/headers';

export const useCasePrioritiesDatalistStore = createTableStore(
	`${CasePrioritiesNamespace}/datalist`,
	{
		apiModule: CasePrioritiesAPI,
		headers,
	},
);
