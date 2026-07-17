import { CaseSourcesAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import { asPiniaStoreFactory } from '../../../../../../../../app/store/asPiniaStoreFactory';
import { CaseSourcesNamespace } from '../../namespace';
import { headers } from './_internals/headers';

export const useCaseSourcesDatalistStore = asPiniaStoreFactory(
	createTableStore(`${CaseSourcesNamespace}/datalist`, {
		apiModule: CaseSourcesAPI,
		headers,
	}),
);
