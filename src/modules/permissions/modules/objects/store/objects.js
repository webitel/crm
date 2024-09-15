import ObjectStoreModule from '../../../../../app/store/BaseStoreModules/StoreModules/ObjectStoreModule';
import ObjectsAPI from '../api/objects';

const actions = {
  RESET_ITEM_STATE: (context) => {
    context.commit('RESET_ITEM_STATE');
  },
};

const objects = new ObjectStoreModule()
  .attachAPIModule(ObjectsAPI)
  .generateAPIActions()
  .getModule({ actions });

export default objects;
