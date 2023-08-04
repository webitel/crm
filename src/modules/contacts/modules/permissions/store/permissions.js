import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import PermissionsAPI from '../api/PermissionsAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
  REQUIRED_FIELDS: () => [],
};

const actions = {
};

const api = new ApiStoreModule()
.generateAPIActions(PermissionsAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({ getters, actions });

const permissions = new BaseStoreModule()
.setChildModules({ table })
.getModule();

export default permissions;
