import ObjectStoreModule from '../../../../../../../app/store/BaseStoreModules/StoreModules/ObjectStoreModule';
import SourcesAPI from '../api/sources';
import headers from './_internals/headers';

const resettableState = {
  itemInstance: {
    name: '',
    description: '',
    type: ''
  },
};

const actions = {
  RESET_ITEM_STATE: async (context) => {
    context.commit('RESET_ITEM_STATE');
  },
};

const sources = new ObjectStoreModule({ resettableState, headers })
  .attachAPIModule(SourcesAPI)
  .generateAPIActions()
  .setChildModules({
    permissions,
  })
  .getModule({ actions });

export default sources;
