import { createStore } from 'vuex';
import contacts from '../../modules/contacts/store/contacts';
import userinfo from '../../modules/userinfo/store/userinfo';
import appearance from '../../modules/appearance/store/appearance';

export default createStore({
  actions: {
    OPEN_SESSION: async (context) => {
      await context.dispatch('userinfo/OPEN_SESSION', null, { root: true });
    },
  },
  modules: {
    contacts,
    userinfo,
    appearance,
  },
});
