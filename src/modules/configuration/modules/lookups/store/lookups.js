import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index';

import closeReasonGroups from '../modules/close-reason-groups/store/close-reason-groups.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';
import customLookup from '../modules/custom-lookup/store/custom-lookup.js';
import slas from '../modules/slas/store/slas.js';

const lookups = createBaseStoreModule({
	modules: {
		slas,
		contactGroups,
		closeReasonGroups,
		customLookup,
	},
});

export default lookups;
