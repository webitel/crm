import { CasesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasesCardNamespace } from '../../namespace';
import { caseValidationSchema } from '../../validations/case.validations';
import { caseListParams } from '../_internals/caseListNavigation';

const getCaseWithListContext = (params: Parameters<typeof CasesAPI.get>[0]) =>
	CasesAPI.get({
		...params,
		listParams: caseListParams.value ?? undefined,
	});

export const useCasesCardStore = createCardStore<WebitelCasesCase>({
	namespace: CasesCardNamespace,
	apiModule: {
		...CasesAPI,
		get: getCaseWithListContext,
	},
	standardValidationSchema: caseValidationSchema as any,
});
