import { createStore } from 'vuex';
import userinfo from '../../modules/userinfo/store/userinfo';

export default createStore({
  actions: {
    OPEN_SESSION: async (context) => {
      await context.dispatch('userinfo/OPEN_SESSION', null, { root: true });
    },
  },
  modules: {
    userinfo,
  },
});
