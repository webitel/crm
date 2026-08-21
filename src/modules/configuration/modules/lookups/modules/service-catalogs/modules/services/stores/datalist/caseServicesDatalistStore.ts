import { ServicesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CatalogServicesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseServicesDatalistStore = createTableStore(
	`${CatalogServicesNamespace}/datalist`,
	{
		apiModule: ServicesAPI,
		headers,
	},
);
