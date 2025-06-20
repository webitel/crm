import './app/assets/icons/sprite';
import './app/css/main.scss';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { configureZod } from '@webitel/ui-sdk/validations';

import App from './app.vue';
import { createUserAccessControl } from './app/composables/useUserAccessControl';
import i18n from './app/locale/i18n';
import { webitelUiOptions, webitelUiPlugin } from './app/plugins/webitel-ui';
import router from './app/router';
import store from './app/store';
import { useUserinfoStore } from './modules/userinfo/store/userinfoStore';

const setTokenFromUrl = (): void => {
  try {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    if (accessToken) {
      localStorage.setItem('access-token', accessToken);
    }
  } catch (err) {
    console.error('Error restoring token from URL', err);
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

const initApp = async () => {
  const app = createApp(App)
    .use(store)
    .use(i18n)
    .use(pinia)
    .use(webitelUiPlugin, webitelUiOptions);

  const { initialize, routeAccessGuard } = useUserinfoStore();
  try {
    await initialize();
    createUserAccessControl(useUserinfoStore);
    router.beforeEach(routeAccessGuard);
  } catch (err) {
    console.error('Error initializing app', err);
  }

  app.use(router);

  return app;
};

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
