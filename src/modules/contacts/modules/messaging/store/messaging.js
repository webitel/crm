import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import MessagingAPI from '../api/MessagingAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
};

const api = new ApiStoreModule()
.generateAPIActions(MessagingAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({getters});

const messaging = new BaseStoreModule()
.setChildModules({ table })
.getModule();

export default messaging;
