import BaseStoreModule from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import PermissionsAPI from '../../../../../modules/_shared/permissions-tab/api/PermissionsAPI';
import AccessMode from '../../../../../modules/permissions/modules/objects/store/_internals/enums/AccessMode.enum';
import BaseOpenedInstanceModule from '../../StoreModuleMixins/BaseOpenedInstanceStoreModuleMixin';
import BaseTableModule from '../../StoreModuleMixins/BaseTableStoreModuleMixin';
import defaultHeaders from './_internals/headers';

export class PermissionsStoreModule extends BaseStoreModule {
  state = {};

  getters = {};

  actions = {
    ...BaseTableModule.getActions(),
    ...BaseOpenedInstanceModule.getActions(),

    CHANGE_CREATE_ACCESS_MODE: (context, payload) =>
      context.dispatch('CHANGE_ACCESS_MODE', {
        ruleName: 'x',
        ...payload,
      }),
    CHANGE_READ_ACCESS_MODE: (context, payload) =>
      context.dispatch('CHANGE_ACCESS_MODE', {
        ruleName: 'r',
        ...payload,
      }),
    CHANGE_UPDATE_ACCESS_MODE: (context, payload) =>
      context.dispatch('CHANGE_ACCESS_MODE', {
        ruleName: 'w',
        ...payload,
      }),
    CHANGE_DELETE_ACCESS_MODE: (context, payload) =>
      context.dispatch('CHANGE_ACCESS_MODE', {
        ruleName: 'd',
        ...payload,
      }),
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
      const changes = {
        grantee: +item.grantee.id,
        grants: want,
      };
      try {
        await context.dispatch('PATCH_ACCESS_MODE', {
          item,
          changes,
        });
      } catch (err) {
        throw err;
      } finally {
        context.dispatch('LOAD_DATA_LIST');
      }
    },
    ADD_ROLE_PERMISSIONS: async (context, role) => {
      const changes = {
        grantee: +role.id,
        grants: 'r',
      };
      try {
        await context.dispatch('PATCH_ACCESS_MODE', {
          changes,
        });
      } catch {
      } finally {
        context.dispatch('LOAD_DATA_LIST');
      }
    },
    RESET_ITEM_STATE: async (context) => {
      context.commit('RESET_ITEM_STATE');
    },
  };

  mutations = {
    ...BaseTableModule.getMutations(),
    ...BaseOpenedInstanceModule.getMutations(),

    RESET_ITEM_STATE: (state) => {
      Object.assign(state, this._resettableState());
    },
  };

  constructor({ headers = defaultHeaders } = {}) {
    super();
    this._resettableState = () => ({
      ...BaseTableModule.generateState(),
      headers,
      parentId: 0,
    });
    this.state = this._resettableState();
  }

  generateAPIActions(url) {
    const permissionsAPI = new PermissionsAPI(url);
    this.actions.GET_LIST = (context) => permissionsAPI.getList(context.state);
    this.actions.PATCH_ACCESS_MODE = (context, { changes }) =>
      permissionsAPI.patch(context.state.parentId, [changes]);
    return this;
  }
}

export default PermissionsStoreModule;
