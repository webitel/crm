import { CaseSourcesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { headers } from './_internals/headers';
// import {WebitelCasesSource} from "@webitel/api-services/gen";

export const useCaseSourcesDatalistStore = createTableStore(
	/*<WebitelCasesSource>*/ 'crm/configuration/lookups/caseSources/datalist',
	{
		apiModule: CaseSourcesAPI,
		headers,
	},
);
