import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';

import customLookups from '../modules/custom-lookups/store/custom-lookups.js';
import dictionaryExtensions from '../modules/dictionary-extensions/store/dictionary-extensions.js';

const customization = createBaseStoreModule({
  modules: {
    customLookups,
    dictionaryExtensions,
  },
});

export default customization;
