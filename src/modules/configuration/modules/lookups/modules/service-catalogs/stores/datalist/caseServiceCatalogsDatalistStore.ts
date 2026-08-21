import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { ServiceCatalogsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseServiceCatalogsDatalistStore = createTableStore(
	`${ServiceCatalogsNamespace}/datalist`,
	{
		apiModule: ServiceCatalogsAPI,
		headers,
	},
);
