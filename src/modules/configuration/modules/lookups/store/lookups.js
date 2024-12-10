import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
    sources,
    contactGroups,
  },
});

export default lookups;
