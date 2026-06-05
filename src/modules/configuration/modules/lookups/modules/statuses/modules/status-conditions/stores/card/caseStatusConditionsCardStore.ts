import { CaseStatusConditionsAPI } from '@webitel/api-services/api';
import { WebitelCasesStatusCondition } from '@webitel/api-services/gen';
import { caseStatusConditionSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseStatusConditionsNamespace } from '../../namespace';

export const useCaseStatusConditionsCardStore =
	createCardStore<WebitelCasesStatusCondition>({
		namespace: `${CaseStatusConditionsNamespace}/card`,
		apiModule: CaseStatusConditionsAPI,
		standardValidationSchema,
	});
