import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';

import customLookups from '../../customization/modules/custom-lookups/store/custom-lookups.js';

const customization = createBaseStoreModule({
  modules: {
    customLookups,
  },
});

export default customization;
