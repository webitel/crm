import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import PermissionsAPI from '../api/PermissionsAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';
import AccessMode from '../enums/AccessMode.enum';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
  REQUIRED_FIELDS: () => [],
};

const actions = {
  CHANGE_CREATE_ACCESS_MODE: (context, payload) => context.dispatch('CHANGE_ACCESS_MODE', { ruleName: 'x', ...payload }),
  CHANGE_READ_ACCESS_MODE: (context, payload) => context.dispatch('CHANGE_ACCESS_MODE', { ruleName: 'r', ...payload }),
  CHANGE_UPDATE_ACCESS_MODE: (context, payload) => context.dispatch('CHANGE_ACCESS_MODE', { ruleName: 'w', ...payload }),
  CHANGE_DELETE_ACCESS_MODE: (context, payload) => context.dispatch('CHANGE_ACCESS_MODE', { ruleName: 'd', ...payload }),
  CHANGE_ACCESS_MODE: async (context, { mode, ruleName, item }) => {
    const have = item.access[ruleName];
    let want;
    /*
         has | patch | got
        -----+-------+-----
           - |  w    | w
           w |  w    | -
           - |  ww   | ww
           w |  ww   | ww
          ww |  ww   | w
          ww |  w    | -
     */
    switch (mode.id) {
      case AccessMode.FORBIDDEN:
        want = ruleName;
        break;
      case AccessMode.ALLOW:
        want = have.rule || ruleName;
        break;
      case AccessMode.MANAGE:
        want = `${ruleName}${ruleName}`;
        break;
      default:
        return;
    }
    const changes = [{
      grantee: +item.grantee.id,
      grants: want,
    }];
    try {
      await context.dispatch('PATCH_ACCESS_MODE', { item, changes });
    } catch (err) {
      throw err;
    } finally {
      await context.dispatch('LOAD_DATA_LIST');
    }
  },
  GRANT_PERMISSIONS: async (context, grantee) => {
    const changes = [{
      grantee: +grantee.id,
      grants: 'r',
    }];
    try {
      await context.dispatch('PATCH_ACCESS_MODE', { changes });
    } finally {
      await context.dispatch('LOAD_DATA_LIST');
    }
  },
  PATCH_ACCESS_MODE: (context, { item, changes }) => context.dispatch('api/PATCH_ITEM', {
    context,
    id: item ? item.id : null,
    changes,
  }),
};

const api = new ApiStoreModule()
.generateAPIActions(PermissionsAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({ getters, actions });

const permissions = new BaseStoreModule()
.setChildModules({ table })
.getModule();

export default permissions;
