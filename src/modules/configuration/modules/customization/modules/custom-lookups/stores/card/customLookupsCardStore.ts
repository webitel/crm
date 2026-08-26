import { AdjunctTypesAPI } from '@webitel/api-services/api';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CustomLookupsNamespace } from '../../namespace';
import { customLookupsSchema } from '../../validations/customLookups.validations';

export const useCustomLookupsCardStore = createCardStore({
	namespace: `${CustomLookupsNamespace}/card`,
	apiModule: AdjunctTypesAPI,
	standardValidationSchema: customLookupsSchema,
});
