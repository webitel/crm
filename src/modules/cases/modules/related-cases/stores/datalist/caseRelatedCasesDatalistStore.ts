import { RelatedCasesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseRelatedCasesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseRelatedCasesDatalistStore = createTableStore(
	CaseRelatedCasesNamespace,
	{
		apiModule: RelatedCasesAPI,
		headers,
		disablePersistence: true,
		isAppendDataList: true,
	},
);
