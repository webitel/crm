import { DynamicConditionsAPI } from '@webitel/api-services/api';
import type { ContactsDynamicCondition } from '@webitel/api-services/gen/models';
import { contactGroupConditionSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactGroupConditionsNamespace } from '../../namespace';

export const useContactGroupConditionsCardStore =
	createCardStore<ContactsDynamicCondition>({
		namespace: `${ContactGroupConditionsNamespace}/card`,
		apiModule: DynamicConditionsAPI,
		standardValidationSchema,
	});
