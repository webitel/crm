import { createBaseStoreModule } from '@webitel/ui-sdk/src/store/new/index.js';
import slas from '../modules/slas/store/slas.js';

const lookups = createBaseStoreModule({
  modules: {
    slas,
  },
});

export default lookups;
