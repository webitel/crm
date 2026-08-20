import webSocketClientController from '@webitel/ui-sdk/src/api/websocket/WebSocketClientController';
import { createStore } from 'vuex';

import appearance from '../../modules/appearance/store/appearance';
import configuration from '../../modules/configuration/store/configuration';

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
		appearance,
		configuration,
	},
});
