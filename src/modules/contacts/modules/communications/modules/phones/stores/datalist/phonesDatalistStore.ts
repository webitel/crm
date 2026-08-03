import { PhonesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CommunicationsNamespace } from '../../../../namespace';
import { headers } from './_internals/headers';

export const usePhonesDatalistStore = createTableStore(
	`${CommunicationsNamespace}/phones/datalist`,
	{
		apiModule: PhonesAPI,
		headers,
	},
);
