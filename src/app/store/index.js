import { createStore } from 'vuex';
import cases from '../../modules/cases/store/cases';
import contacts from '../../modules/contacts/store/contacts';
import userinfo from '../../modules/userinfo/store/userinfo';
import appearance from '../../modules/appearance/store/appearance';
import instance from '../api/instance';
import configuration from '../../modules/configuration/store/configuration';
import webSocketClientController from '../../../node_modules/@webitel/ui-sdk/src/websocket/WebSocketClientController';

export default createStore({
  state: {
    router: null,
    client: webSocketClientController,
  },
  getters: {
    CLIENT: (state) => state.client,
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
    cases,
  },
});
