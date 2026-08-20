import { createCardStore } from '@webitel/ui-datalist/card';
import { computed } from 'vue';

import { CustomLookupAPI } from '../../api/customLookup';
import { CustomLookupNamespace } from '../../namespace';
import { buildCustomLookupValidationSchema } from '../../validations/buildCustomLookupValidationSchema';
import { customLookupFields } from '../_internals/customLookupFields';

export const useCustomLookupCardStore = createCardStore({
	namespace: `${CustomLookupNamespace}/card`,
	apiModule: CustomLookupAPI,
	standardValidationSchema: computed(() =>
		buildCustomLookupValidationSchema(customLookupFields.value),
	),
});
