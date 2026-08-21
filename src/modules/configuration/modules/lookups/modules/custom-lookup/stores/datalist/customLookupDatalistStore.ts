import { createTableStore } from '@webitel/ui-datalist';

import { CustomLookupAPI } from '../../api/customLookup';
import { CustomLookupNamespace } from '../../namespace';

// headers are dynamic (built from the current dictionary's schema) — seeded
// empty here, set at runtime via `updateShownHeaders()`, see the-custom-lookup.vue
export const useCustomLookupDatalistStore = createTableStore(
	`${CustomLookupNamespace}/datalist`,
	{
		apiModule: CustomLookupAPI,
		headers: [],
	},
);
