import { CaseSourcesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { headers } from './_internals/headers';
import { CaseSourcesNamespace } from '../../namespace';

export const useCaseSourcesDatalistStore = createTableStore(
	`${CaseSourcesNamespace}/datalist`,
	{
		apiModule: CaseSourcesAPI,
		headers,
	},
);
