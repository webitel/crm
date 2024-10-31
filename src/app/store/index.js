import { createStore } from 'vuex';
import contacts from '../../modules/contacts/store/contacts';
import userinfo from '../../modules/userinfo/store/userinfo';
import appearance from '../../modules/appearance/store/appearance';
import configuration from '../../modules/configuration/store/configuration';
import instance from '../api/instance';

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
    configuration,
  },
});
