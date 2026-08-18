import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index';

import customLookup from '../modules/custom-lookup/store/custom-lookup.js';

const lookups = createBaseStoreModule({
	modules: {
		customLookup,
	},
});

export default lookups;
