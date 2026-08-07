import { CommentsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CaseCommentsNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const createCaseCommentsComposableTableStore = () =>
	createTableStore(CaseCommentsNamespace, {
		apiModule: CommentsAPI,
		headers,
		disablePersistence: true,
		isAppendDataList: true,
		storeType: 'composable',
	});
