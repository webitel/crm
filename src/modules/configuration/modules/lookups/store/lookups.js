import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import closeReasonGroups
  from '../modules/close-reason-groups/store/close-reason-groups.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';
import catalogs from '../modules/service-catalogs/store/service-catalogs.js';
import services from '../modules/service-catalogs/modules/services/store/services.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
    catalogs,
    sources,
    contactGroups,
    services,
    closeReasonGroups,
  },
});

export default lookups;
