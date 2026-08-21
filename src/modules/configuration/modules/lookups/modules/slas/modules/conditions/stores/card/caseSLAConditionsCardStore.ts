import type { WebitelCasesSLACondition } from '@webitel/api-services/gen/models';
import { slaConditionSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import ConditionsAPI from '../../api/conditions';
import { SLAConditionsNamespace } from '../../namespace';

export const useSLAConditionsCardStore =
	createCardStore<WebitelCasesSLACondition>({
		namespace: `${SLAConditionsNamespace}/card`,
		apiModule: ConditionsAPI,
		standardValidationSchema,
	});
