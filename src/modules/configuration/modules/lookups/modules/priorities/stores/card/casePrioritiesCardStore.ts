import { CasePrioritiesAPI } from '@webitel/api-services/api';
import type { WebitelCasesPriority } from '@webitel/api-services/gen/models';
import { casePrioritySchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasePrioritiesNamespace } from '../../namespace';

export const useCasePrioritiesCardStore = createCardStore<WebitelCasesPriority>(
	{
		namespace: `${CasePrioritiesNamespace}/card`,
		apiModule: CasePrioritiesAPI,
		standardValidationSchema,
	},
);
