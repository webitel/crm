import './app/assets/icons/sprite';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './app.vue';
import { createUserAccessControl } from './app/composables/useUserAccessControl';
import i18n from './app/locale/i18n';
import WebitelUi from './app/plugins/webitel-ui';
import router from './app/router';
import store from './app/store';
import { useUserinfoStore } from './modules/userinfo/store/userinfoStore';

const setTokenFromUrl = () => {
  try {
    const queryMap = window.location.search.slice(1)
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

const initApp = async () => {
  const app = createApp(App)
      .use(store)
      .use(i18n)
      .use(pinia)
      .use(...WebitelUi);

  const { initialize, routeAccessGuard } = useUserinfoStore();
  await initialize();
  createUserAccessControl(useUserinfoStore);
  router.beforeEach(routeAccessGuard);

  app.use(router);

  return app;
}

(async () => {
  let config;
  try {
    setTokenFromUrl();
    config = await fetchConfig();
    store.commit('SET_ROUTER', router);
    await store.dispatch('OPEN_SESSION');
  } catch (err) {
    console.error('before app mount error:', err);
  } finally {
    const app = await initApp();
    app.provide('$config', config);
    app.mount('#app');
  }
})();
