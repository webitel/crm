import { AdjunctTypesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CustomLookupsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCustomLookupsDatalistStore = createTableStore(
	`${CustomLookupsNamespace}/datalist`,
	{
		apiModule: AdjunctTypesAPI,
		headers,
	},
);
