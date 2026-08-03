import { VariablesAPI } from '@webitel/api-services/api';
import type { ContactsVariable } from '@webitel/api-services/gen/models';
import { variableSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactsNamespace } from '../../../../namespace';

export const useVariablesCardStore = createCardStore<ContactsVariable>({
	namespace: `${ContactsNamespace}/variables/card`,
	apiModule: VariablesAPI,
	standardValidationSchema,
});
