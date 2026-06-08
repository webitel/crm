import { CasePrioritiesAPI } from '@webitel/api-services/api';
import {
	CreatePriorityBody as standardValidationSchema,
	WebitelCasesPriority,
} from '@webitel/api-services/gen';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasePrioritiesNamespace } from '../../namespace';

export const useCasePrioritiesCardStore = createCardStore<WebitelCasesPriority>(
	{
		namespace: `${CasePrioritiesNamespace}/card`,
		apiModule: CasePrioritiesAPI,
		standardValidationSchema,
	},
);
