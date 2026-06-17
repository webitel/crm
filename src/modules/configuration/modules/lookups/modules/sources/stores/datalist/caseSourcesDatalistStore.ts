import { CaseSourcesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import { CaseSourcesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseSourcesDatalistStore = createTableStore(
	`${CaseSourcesNamespace}/datalist`,
	{
		apiModule: CaseSourcesAPI,
		headers,
	},
);
