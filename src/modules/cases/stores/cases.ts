import { createTableStore } from '@webitel/ui-datalist';

import CasesAPI from '../api/CasesAPI';
import { CasesNamespace } from '../namespace';
import { headers } from '../store/_internals/headers';

export const useCasesStore = createTableStore(CasesNamespace, {
	apiModule: CasesAPI,
	headers,
});
