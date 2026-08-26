import { CaseCloseReasonsAPI } from '@webitel/api-services/api';
import type { WebitelCasesCloseReason } from '@webitel/api-services/gen/models';
import { caseCloseReasonSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseCloseReasonsNamespace } from '../../namespace';

export const useCaseCloseReasonsCardStore =
	createCardStore<WebitelCasesCloseReason>({
		namespace: `${CaseCloseReasonsNamespace}/card`,
		apiModule: CaseCloseReasonsAPI,
		standardValidationSchema,
	});
