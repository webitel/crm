import webSocketClientController from '@webitel/ui-sdk/src/api//websocket/websocketErrorEventHandler.js';
import { createStore } from 'vuex';

import appearance from '../../modules/appearance/store/appearance';
import cases from '../../modules/cases/store/cases';
import configuration from '../../modules/configuration/store/configuration';
import contacts from '../../modules/contacts/store/contacts';
import customization from '../../modules/customization/store/customization';
import userinfo from '../../modules/userinfo/store/deprecated/userinfo';
import instance from '../api/instance';

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
      await context.dispatch(
        'userinfo/OPEN_SESSION',
        { instance },
        { root: true },
      );
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
    customization,
    cases,
  },
});
