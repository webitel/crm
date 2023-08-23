import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
// import CardStoreModule
//   from '@webitel/ui-sdk/src/modules/CardStoreModule/store/CardStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import CardStoreModule
  from './CardStoreModule';
import ContactsAPI from '../api/ContactsAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';
import emails from '../modules/emails/store/emails';
import permissions from '../modules/permissions/store/permissions';

const cardState = {
  itemInstance: {
    name: {
      commonName: '',
    },
    timezones: [],
    managers: [],
    labels: [],
    about: '',
  },
};

const tableGetters = {
  REQUIRED_FIELDS: () => ['mode'],
};

const api = new ApiStoreModule()
  .generateAPIActions(ContactsAPI)
  .getModule();

const table = new TableStoreModule({ headers })
  .setChildModules({ api, filters })
  .getModule({ getters: tableGetters });

const card = new CardStoreModule()
  .setChildModules({ api, emails, permissions })
  .getModule({ state: cardState });

const contacts = new BaseStoreModule()
  .setChildModules({ table, card })
  .getModule();
export default contacts;
