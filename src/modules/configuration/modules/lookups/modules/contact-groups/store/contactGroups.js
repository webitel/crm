import { ContactGroupsAPI } from '@webitel/api-services/api';
import { createObjectPermissionsStoreModule } from '@webitel/ui-sdk/src/modules/ObjectPermissions/store/index.js';
import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';

import conditions from '../modules/conditions/store/conditions';
import filters from '../modules/filters/store/filters.js';
import headers from './_internals/headers';

const resetCardState = {
  itemId: '',
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
  state: { headers },
  modules: {
    filters,
    api,
  },
});

const permissions = createObjectPermissionsStoreModule({
  modules: {
    table: {
      getters: {
        PARENT_ID: (s, g, rootState) =>
          rootState.configuration.lookups.contactGroups.card.itemId,
      },
      modules: {
        api,
      },
    },
  },
});

const card = createCardStoreModule({
  state: {
    itemInstance: resetCardState.itemInstance,
    _resettable: resetCardState,
  },
  modules: {
    api,
    conditions,
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
