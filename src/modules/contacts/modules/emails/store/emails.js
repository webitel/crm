import CardStoreModule
  from '@webitel/ui-sdk/src/modules/CardStoreModule/store/CardStoreModule';
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
};

const api = new ApiStoreModule()
.generateAPIActions(EmailsAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({ getters });

const card = new CardStoreModule()
.setChildModules({ api })
.getModule();

const emails = new BaseStoreModule()
.setChildModules({ table, card })
.getModule();

export default emails;
