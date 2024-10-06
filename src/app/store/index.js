import { createStore } from 'vuex';
import contacts from '../../modules/contacts/store/contacts';
import userinfo from '../../modules/userinfo/store/userinfo';
import appearance from '../../modules/appearance/store/appearance';
import instance from '../api/instance';

import sources from '../../modules/lookups/modules/sources/store/sources';
import permissions from '../../modules/permissions/store/permissions';
// import routing from '../../modules/routing/store/routing';

export default createStore({
  state: {
    router: null,
  },
  actions: {
    OPEN_SESSION: async (context) => {
      await context.dispatch('userinfo/OPEN_SESSION', { instance }, { root: true });
    },
  },
  mutations: {
    SET_ROUTER: (state, router) => {
      state.router = router;
    },
  },
  modules: {
    contacts,
    userinfo,
    appearance,

    sources,
    permissions,
    // routing
  },
});
