import { CasePrioritiesAPI } from '@webitel/api-services/api';
import { casePrioritySchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CasePrioritiesNamespace } from '../../namespace';

export const useCasePrioritiesCardStore = createCardStore({
	namespace: `${CasePrioritiesNamespace}/card`,
	apiModule: CasePrioritiesAPI,
	standardValidationSchema,
});
