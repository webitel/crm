import {
	CreateSLAConditionBody as standardValidationSchema,
	WebitelCasesSLACondition,
} from '@webitel/api-services/gen';
import { createCardStore } from '@webitel/ui-datalist/card';

import ConditionsAPI from '../../api/conditions';
import { SLAConditionsNamespace } from '../../namespace';

export const useSLAConditionsCardStore =
	createCardStore<WebitelCasesSLACondition>({
		namespace: `${SLAConditionsNamespace}/card`,
		apiModule: ConditionsAPI,
		standardValidationSchema,
	});
