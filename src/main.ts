import './app/assets/icons/sprite';
import './app/css/main.scss';

import { configureZod } from '@webitel/ui-sdk/validations';
import { eventBus } from '@webitel/ui-sdk/scripts';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { setConfig as setApiServicesConfig } from '@webitel/api-services';

import App from './app.vue';
import { createUserAccessControl } from './app/composables/useUserAccessControl';
import i18n from './app/locale/i18n';
import { plugin as WebitelUi, options as WebitelUiOptions } from './app/plugins/webitel/ui-sdk';
import { initRouter, router } from './app/router';
import store from './app/store';
import { useUserinfoStore } from './modules/userinfo/store/userinfoStore';

const setTokenFromUrl = () => {
	try {
		const queryMap: {
			accessToken?: string;
		} = window.location.search
			.slice(1)
			.split('&')
			.reduce((obj, query) => {
				const [key, value] = query.split('=');
				obj[key] = value;
				return obj;
			}, {});

		if (queryMap.accessToken) {
			localStorage.setItem('access-token', queryMap.accessToken);
		}
	} catch (err) {
		console.error('Error restoring token from url', err);
	}
};

const fetchConfig = async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}/config.json`);
  return response.json();
};

const pinia = createPinia();

configureZod({
  t: i18n.global.t,
});

setApiServicesConfig({
  eventBus,
});

const initApp = async () => {
  const app = createApp(App)
    .use(store)
    .use(i18n)
    .use(pinia);

  const { initialize, routeAccessGuard } = useUserinfoStore();
  try {
    await initialize();
    createUserAccessControl(useUserinfoStore);
    await initRouter({
      beforeEach: [routeAccessGuard],
    });
  } catch (err) {
    console.error('Error initializing app', err);
  }


  app.use(router);
  app.use(WebitelUi, {
    ...WebitelUiOptions,
    router,
  }); // setup webitel ui after router init

  return app;
};

(async () => {
  let config;
  try {
    setTokenFromUrl();
    config = await fetchConfig();
    store.commit('SET_ROUTER', router);
  } catch (err) {
    console.error('before app mount error:', err);
  } finally {
    const app = await initApp();
    app.provide('$config', config);
    app.mount('#app');
  }
})();
