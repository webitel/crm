import { SLAConditionsAPI } from '@webitel/api-services/api';
import type { WebitelCasesSLACondition } from '@webitel/api-services/gen/models';
import { caseSLAConditionSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { SLAConditionsNamespace } from '../../namespace';

export const useSLAConditionsCardStore =
	createCardStore<WebitelCasesSLACondition>({
		namespace: `${SLAConditionsNamespace}/card`,
		apiModule: SLAConditionsAPI,
		standardValidationSchema,
	});
