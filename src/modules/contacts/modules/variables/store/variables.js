import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import VariablesAPI from '../api/VariablesAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
  REQUIRED_FIELDS: () => ['etag'],
};

const actions = {
  ADD_VARIABLE: async (context, { itemInstance }) => {
    try {
      await context.dispatch('api/POST_ITEM', {
        parentId: context.getters.PARENT_ID,
        itemInstance,
      });
    } finally {
      await context.dispatch('LOAD_DATA_LIST');
    }
  },
  UPDATE_VARIABLE: async (context, { etag, itemInstance }) => {
    try {
      await context.dispatch('api/UPD_ITEM', {
        parentId: context.getters.PARENT_ID,
        etag,
        itemInstance,
      });
    } finally {
      await context.dispatch('LOAD_DATA_LIST');
    }
  },
}

const api = new ApiStoreModule()
  .generateAPIActions(VariablesAPI)
  .getModule();

const table = new TableStoreModule({ headers })
  .setChildModules({ api, filters })
  .getModule({ getters, actions });

const variables = new BaseStoreModule()
  .setChildModules({ table })
  .getModule();

export default variables;
