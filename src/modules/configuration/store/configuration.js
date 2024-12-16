import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import lookups from '../modules/lookups/store/lookups.js';

const configuration = createBaseStoreModule({
  modules: {
    lookups,
  },
});

export default configuration;
