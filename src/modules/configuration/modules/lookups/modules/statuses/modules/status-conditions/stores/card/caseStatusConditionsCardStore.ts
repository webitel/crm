import { CaseStatusConditionsAPI } from '@webitel/api-services/api';
import { WebitelCasesStatusCondition } from '@webitel/api-services/gen';
import { caseStatusConditionSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseStatusConditionsCardNamespace } from '../../namespace';

export const useCaseStatusConditionsCardStore =
	createCardStore<WebitelCasesStatusCondition>({
		namespace: CaseStatusConditionsCardNamespace,
		apiModule: CaseStatusConditionsAPI,
		standardValidationSchema,
	});
