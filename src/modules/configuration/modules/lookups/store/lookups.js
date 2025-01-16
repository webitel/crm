import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';
import priorities from '../modules/priorities/store/priorities.js';

import catalogs from '../modules/service-catalogs/store/service-catalogs.js';
import services from '../modules/service-catalogs/modules/services/store/services.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
    catalogs,
    sources,
    contactGroups,
    priorities,
    services,
  },
});

export default lookups;
