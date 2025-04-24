import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import { headers } from '../../_shared/modules/contacts/store/_internals/headers';
import ContactsAPI from '../api/ContactsAPI';
import cases from '../modules/cases/store/cases';
import emails from '../modules/emails/store/emails';
import filters from '../modules/filters/store/filters';
import messaging from '../modules/messaging/store/messaging';
import permissions from '../modules/permissions/store/permissions';
import phones from '../modules/phones/store/phones';
import variables from '../modules/variables/store/variables';

const cardState = {
  itemInstance: {
    name: '',
    timezones: [],
    managers: [],
    groups: [],
    labels: [],
    about: '',
    user: null,
  },
};

const tableGetters = {
  // REQUIRED_FIELDS: () => ['mode'],
};

const api = createApiStoreModule({
  state: {
    api: ContactsAPI,
  },
});

const table = createTableStoreModule({
  state: { headers },
  getters: tableGetters,
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: {
    _resettable: cardState,
    itemInstance: cardState.itemInstance,
  },
  modules: {
    api,
    emails,
    phones,
    messaging,
    variables,
    permissions,
    cases,
  },
});

const contacts = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});
export default contacts;
