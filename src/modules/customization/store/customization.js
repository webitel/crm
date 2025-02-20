import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';

import customLookups from '../modules/custom-lookups/store/custom-lookups.js';
import wtTypeExtension from '../modules/wt-type-extension/store/wt-type-extension.js';

const customization = createBaseStoreModule({
  modules: {
    customLookups,
    wtTypeExtension,
  },
});

export default customization;
