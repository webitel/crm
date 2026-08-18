import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index';

import customLookup from '../modules/custom-lookup/store/custom-lookup.js';
import services from '../modules/service-catalogs/modules/services/store/services.js';
import catalogs from '../modules/service-catalogs/store/service-catalogs.js';

const lookups = createBaseStoreModule({
	modules: {
		catalogs,
		services,
		customLookup,
	},
});

export default lookups;
