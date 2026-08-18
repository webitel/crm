import { DynamicConditionsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { ContactGroupConditionsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useContactGroupConditionsDatalistStore = createTableStore(
	`${ContactGroupConditionsNamespace}/datalist`,
	{
		apiModule: DynamicConditionsAPI,
		headers,
	},
);
