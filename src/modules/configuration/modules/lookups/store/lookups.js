import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';
import priorities from '../modules/priorities/store/priorities.js';


const lookups = createBaseStoreModule({
  modules: {
    slas,
    sources,
    contactGroups,
    priorities,
  },
});

export default lookups;
