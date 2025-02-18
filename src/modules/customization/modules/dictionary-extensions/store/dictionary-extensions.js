import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
} from '@webitel/ui-sdk/store';

import DictionaryExtensionApi from '../api/dictionary-extensions.js';

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
    api: DictionaryExtensionApi,
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

const dictionaryExtensions = createBaseStoreModule({
  modules: {
    card,
  },
});

export default dictionaryExtensions;
