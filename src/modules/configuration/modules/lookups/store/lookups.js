import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index';

import contactGroups from '../modules/contact-groups/store/contactGroups.js';
import customLookup from '../modules/custom-lookup/store/custom-lookup.js';
import services from '../modules/service-catalogs/modules/services/store/services.js';
import catalogs from '../modules/service-catalogs/store/service-catalogs.js';
import slas from '../modules/slas/store/slas.js';

const lookups = createBaseStoreModule({
	modules: {
		slas,
		catalogs,
		contactGroups,
		services,
		customLookup,
	},
});

export default lookups;
