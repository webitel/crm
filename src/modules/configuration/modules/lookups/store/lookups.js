import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import catalogs from '../modules/service-catalogs/store/service-catalogs.js';
import services from '../modules/service-catalogs/modules/services/store/services.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
    catalogs,
    sources,
    services,
    contactGroups,
  },
});

export default lookups;
