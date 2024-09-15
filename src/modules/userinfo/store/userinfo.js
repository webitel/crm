import UserinfoStoreModule from '@webitel/ui-sdk/src/modules/Userinfo/store/UserinfoStoreModule';
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';

const state = {
  thisApp: WebitelApplications.CRM,
};

const getters = {
  GET_OBJECT_SCOPE_BY_NAME: (state) => (name) => (
    Object.values(state.scope).find((object) => name === object.class)
  ),
  GET_OBJECT_SCOPE_BY_CLASS: (state) => (scopeClass) => {
    return Object.values(state.scope).find((object) => object.class === scopeClass)
  },
  ALLOW_SECTION_ACCESS: (state, getters) => ({ scopeClass, name, route }) => {
    return getters.GET_OBJECT_SCOPE_BY_CLASS(scopeClass) && getters.CHECK_OBJECT_ACCESS({ name, route });
  },
};

const userinfo = new UserinfoStoreModule().getModule({ state, getters });

export default userinfo;
