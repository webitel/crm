import webSocketClientController from '@webitel/ui-sdk/src/api/websocket/WebSocketClientController';
import { createStore } from 'vuex';

import appearance from '../../modules/appearance/store/appearance';
import cases from '../../modules/cases/store/cases';
import configuration from '../../modules/configuration/store/configuration';
import contacts from '../../modules/contacts/store/contacts';
import customization from '../../modules/customization/store/customization';
import timeline from '../../modules/timeline/store/timeline';

export default createStore({
	state: {
		router: null,
		client: webSocketClientController,
	},
	getters: {
		CLIENT: (state) => state.client,
	},
	mutations: {
		SET_ROUTER: (state, router) => {
			state.router = router;
		},
	},
	modules: {
		contacts,
		appearance,
		configuration,
		customization,
		cases,
		timeline,
	},
});
