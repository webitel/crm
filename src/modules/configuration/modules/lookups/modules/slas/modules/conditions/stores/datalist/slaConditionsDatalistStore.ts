import { SLAConditionsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { SLAConditionsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useSLAConditionsDatalistStore = createTableStore(
	`${SLAConditionsNamespace}/datalist`,
	{
		apiModule: SLAConditionsAPI,
		headers,
	},
);
