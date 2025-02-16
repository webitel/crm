import CardStoreModule
  from '@webitel/ui-sdk/src/modules/CardStoreModule/store/CardStoreModule';
import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';

import ContactsAPI from '../api/ContactsAPI';
import emails from '../modules/emails/store/emails';
import filters from '../modules/filters/store/filters';
import messaging from '../modules/messaging/store/messaging';
import permissions from '../modules/permissions/store/permissions';
import phones from '../modules/phones/store/phones';
import variables from '../modules/variables/store/variables';
import headers from './_internals/headers';

const cardState = {
  itemInstance: {
    name: '',
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
  .setChildModules({ api, emails, phones, messaging, variables, permissions })
  .getModule({ state: cardState });

const contacts = new BaseStoreModule()
  .setChildModules({ table, card })
  .getModule();
export default contacts;
