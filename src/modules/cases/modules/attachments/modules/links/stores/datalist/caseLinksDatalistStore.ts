import { CaseLinksAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseLinksNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseLinksDatalistStore = createTableStore(CaseLinksNamespace, {
	apiModule: CaseLinksAPI,
	headers,
	disablePersistence: true,
});
