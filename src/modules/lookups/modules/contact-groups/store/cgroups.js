import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import CardStoreModule
  from '@webitel/ui-sdk/src/modules/CardStoreModule/store/CardStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import ContactsAPI from '../../../../contacts/api/ContactsAPI';
import CGroupsAPI from '../../../../contacts/api/CGroupsAPI';
import headers from './_internals/headers';
import filters from '../../../../contacts/modules/filters/store/filters';
import timeline from '../../../../contacts/modules/timeline/store/timeline';
import emails from '../../../../contacts/modules/emails/store/emails';
import phones from '../../../../contacts/modules/phones/store/phones';
import messaging from '../../../../contacts/modules/messaging/store/messaging';
import permissions from '../../../../contacts/modules/permissions/store/permissions';
import variables from '../../../../contacts/modules/variables/store/variables';

const cardState = {
  itemInstance: {
    name: '',
    timezones: [],
    managers: [],
    labels: [],
    about: '',
    description: ''
  },
};

const tableGetters = {
  REQUIRED_FIELDS: () => ['mode'],
};

const api = new ApiStoreModule()
.generateAPIActions(CGroupsAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({ getters: tableGetters });

const card = new CardStoreModule()
.setChildModules({ api, timeline, emails, phones, messaging, variables, permissions })
.getModule({ state: cardState });

const contacts = new BaseStoreModule()
.setChildModules({ table, card })
.getModule();
export default contacts;
