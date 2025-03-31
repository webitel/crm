import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import UserinfoStoreModule from '@webitel/ui-sdk/src/modules/Userinfo/store/UserinfoStoreModule';

const state = {
  thisApp: WebitelApplications.CRM,
};

const getters = {
  GET_OBJECT_SCOPE_BY_NAME: (state) => (name) =>
    Object.values(state.scope).find((object) => name === object.class),
};

const userinfo = new UserinfoStoreModule().getModule({ state, getters });

export default userinfo;
