import { CasesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasesCardNamespace } from '../../namespace';
import { caseValidationSchema } from '../../validations/buildCaseValidationSchema';

export const useCasesCardStore = createCardStore<WebitelCasesCase>({
	namespace: CasesCardNamespace,
	apiModule: CasesAPI,
	standardValidationSchema: caseValidationSchema,
});
