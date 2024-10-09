import ObjectStoreModule from '../../../../../../../app/store/BaseStoreModules/StoreModules/ObjectStoreModule';
import PermissionsStoreModule from '../../../../../../../app/store/BaseStoreModules/StoreModules/PermissionsStoreModule/PermissionsStoreModule';
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

const PERMISSIONS_API_URL = '/contacts/groups';
const permissions = new PermissionsStoreModule()
  .generateAPIActions(PERMISSIONS_API_URL)
  .getModule();

const sources = new ObjectStoreModule({ resettableState, headers })
  .attachAPIModule(SourcesAPI)
  .generateAPIActions()
  .setChildModules({
    permissions,
  })
  .getModule({ actions });

export default sources;