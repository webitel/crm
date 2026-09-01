import { CasesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { caseSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasesCardNamespace } from '../../namespace';

export const useCasesCardStore = createCardStore<WebitelCasesCase>({
	namespace: CasesCardNamespace,
	apiModule: CasesAPI,
	standardValidationSchema,
});
