import { CaseStatusesAPI } from '@webitel/api-services/api';
import type { WebitelCasesStatus } from '@webitel/api-services/gen';
import { caseStatusSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseStatusesNamespace } from '../../namespace';

export const useCaseStatusesCardStore = createCardStore<WebitelCasesStatus>({
	namespace: `${CaseStatusesNamespace}/card`,
	apiModule: CaseStatusesAPI,
	standardValidationSchema,
});
