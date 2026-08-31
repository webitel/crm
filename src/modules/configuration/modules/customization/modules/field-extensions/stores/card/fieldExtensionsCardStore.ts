import { WtTypeExtensionAPI } from '@webitel/api-services/api';
import { typeExtensionSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { FieldExtensionsNamespace } from '../../namespace';

export const useFieldExtensionsCardStore = createCardStore({
	namespace: `${FieldExtensionsNamespace}/card`,
	apiModule: WtTypeExtensionAPI,
	standardValidationSchema: typeExtensionSchema,
});
