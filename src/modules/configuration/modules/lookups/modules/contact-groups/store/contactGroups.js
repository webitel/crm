import { createObjectPermissionsStoreModule } from '@webitel/ui-sdk/src/modules/ObjectPermissions/store/index.js';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import ContactGroupsAPI from '../api/contactGroups.js';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters.js';

const resettableState = {
  itemInstance: {
    name: '',
    description: '',
    type: '',
    enabled: true,
  },
};

const api = createApiStoreModule({
  state: {
    api: ContactGroupsAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  modules: {
    filters,
    api,
  },
});

const permissions = createObjectPermissionsStoreModule({
  modules: {
    table: {
      getters: {
        PARENT_ID: (s, g, rootState) => rootState.configuration.lookups.contactGroups.card.itemId,
      },
      modules: {
        api,
      },
    },
  },
});

const card = createCardStoreModule({
  state: { _resettable: resettableState },
  modules: {
    api,
    permissions,
  },
});

const contactGroups = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default contactGroups;