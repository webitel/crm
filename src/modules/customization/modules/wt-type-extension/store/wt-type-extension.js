import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
} from '@webitel/ui-sdk/store';

import WtTypeExtensionApi from '../api/wt-type-extension.js';

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    repo: '',
    fields: [],
  },
};

const api = createApiStoreModule({
  state: {
    api: WtTypeExtensionApi,
  },
});

const card = createCardStoreModule({
  state: {
    itemInstance: resetCardState.itemInstance,
    _resettable: resetCardState,
  },
  modules: {
    api,
  },
});

const wtTypeExtension = createBaseStoreModule({
  modules: {
    card,
  },
});

export default wtTypeExtension;
