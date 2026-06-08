import { SlasAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { SLANamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseSlasDatalistStore = createTableStore(
	`${SLANamespace}/datalist`,
	{
		apiModule: SlasAPI,
		headers,
	},
);
