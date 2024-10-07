import { createApp } from 'vue';
import App from './app.vue';
import router from './app/router';
import i18n from './app/locale/i18n';
import WebitelUi from './app/plugins/webitel-ui';
import store from './app/store';
import ActionComponents from './app/components/actions';

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

const initApp = () => {
  const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(...WebitelUi)

  ActionComponents.forEach((component) => {
    app.component(component.name, component);
  });

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
    const app = initApp();
    app.provide('$config', config);
    app.mount('#app');
  }
})();

