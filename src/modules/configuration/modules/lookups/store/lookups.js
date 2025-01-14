import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import closeReasonGroups
  from '../modules/close-reason-groups/store/close-reason-groups.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
    sources,
    contactGroups,
    closeReasonGroups,
  },
});

export default lookups;
