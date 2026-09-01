import { CasesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CasesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCasesDatalistStore = createTableStore(CasesNamespace, {
	apiModule: CasesAPI,
	headers,
});
