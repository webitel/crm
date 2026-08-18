import { createTableStore } from '@webitel/ui-datalist';

import ConditionsAPI from '../../api/conditions';
import { SLAConditionsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useSLAConditionsDatalistStore = createTableStore(
	`${SLAConditionsNamespace}/datalist`,
	{
		apiModule: ConditionsAPI,
		headers,
	},
);
