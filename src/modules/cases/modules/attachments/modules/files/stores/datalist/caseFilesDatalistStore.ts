import { CaseFilesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseFilesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseFilesDatalistStore = createTableStore(CaseFilesNamespace, {
	apiModule: CaseFilesAPI,
	headers,
	disablePersistence: true,
});
