import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';

import closeReasonGroups from '../modules/close-reason-groups/store/close-reason-groups.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';
import customLookup from '../modules/custom-lookup/store/custom-lookup.js';
import priorities from '../modules/priorities/store/priorities.js';
import services from '../modules/service-catalogs/modules/services/store/services.js';
import catalogs from '../modules/service-catalogs/store/service-catalogs.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import statuses from '../modules/statuses/store/statuses.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
    catalogs,
    sources,
    contactGroups,
    priorities,
    services,
    closeReasonGroups,
    statuses,
    customLookup,
  },
});

export default lookups;
