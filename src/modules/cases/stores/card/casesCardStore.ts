import { CasesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasesCardNamespace } from '../../namespace';
import { caseValidationSchema } from '../../validations/case.validations';
import {
	caseListParams,
	caseNeighbors,
} from '../_internals/caseListNavigation';

export const useCasesCardStore = createCardStore<WebitelCasesCase>({
	namespace: CasesCardNamespace,
	apiModule: {
		...CasesAPI,
		get: async (params: Parameters<typeof CasesAPI.get>[0]) => {
			const item = await CasesAPI.get({
				...params,
				listParams: caseListParams.value ?? undefined,
			});
			caseNeighbors.value = {
				hasPrev: item.hasPrev ?? false,
				hasNext: item.hasNext ?? false,
			};
			return item;
		},
	},
	standardValidationSchema: caseValidationSchema as any,
});
