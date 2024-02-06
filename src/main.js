import { createApp } from 'vue';
import App from './app.vue';
import router from './app/router';
import i18n from './app/locale/i18n';
import WebitelUi from './app/plugins/webitel-ui';
import store from './app/store';

const fetchConfig = async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}/config.json`);
  return response.json();
};

console.warn('ENV', import.meta.env, process.env, process?.env?.VUE_APP_API_URL || import.meta.env.VITE_API_URL);

const initApp = () => createApp(App)
.use(store)
.use(router)
.use(i18n)
.use(...WebitelUi);

(async () => {
  let config;
  try {
    config = await fetchConfig();
    await store.dispatch('OPEN_SESSION');
  } catch (err) {
    console.error('before app mount error:', err);
  } finally {
    const app = initApp();
    app.provide('$config', config);
    app.mount('#app');
  }
})();
