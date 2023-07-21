import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import EmailsAPI from '../api/EmailsAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
  REQUIRED_FIELDS: () => ['etag'],
};

const actions = {
  SET_AS_PRIMARY: async (context, { item }) => {
    /*
     can't use default table patch action because default action is changing UI value,
     so there's would be 2 primary records which is incorrect :)
    */
    try {
      const changes = { primary: true };
      await context.dispatch('api/PATCH_ITEM', { context, etag: item.etag, changes });
    } finally {
      await context.dispatch('LOAD_DATA_LIST');
    }
  },
  ADD_EMAIL: async (context, { itemInstance }) => {
    try {
      await context.dispatch('api/POST_ITEM', {
        parentId: context.getters.PARENT_ID,
        itemInstance,
      });
    } finally {
      await context.dispatch('LOAD_DATA_LIST');
    }
  },
  UPDATE_EMAIL: async (context, { etag, itemInstance }) => {
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
};

const api = new ApiStoreModule()
.generateAPIActions(EmailsAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({ getters, actions });

const emails = new BaseStoreModule()
.setChildModules({ table })
.getModule();

export default emails;
