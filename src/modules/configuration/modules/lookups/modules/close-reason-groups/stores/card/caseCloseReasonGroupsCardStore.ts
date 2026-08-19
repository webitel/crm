import { CaseCloseReasonGroupsAPI } from '@webitel/api-services/api';
import type { WebitelCasesCloseReasonGroup } from '@webitel/api-services/gen/models';
import { caseCloseReasonGroupSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseCloseReasonGroupsNamespace } from '../../namespace';

export const useCaseCloseReasonGroupsCardStore =
	createCardStore<WebitelCasesCloseReasonGroup>({
		namespace: `${CaseCloseReasonGroupsNamespace}/card`,
		apiModule: CaseCloseReasonGroupsAPI,
		standardValidationSchema,
	});
