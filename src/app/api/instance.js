import axios from 'axios';
import defaultInterceptorsSetup from './interceptors/defaultInterceptorsSetup';

// config with specific properties which doesn't fit to axios config
export const config = {
  errors: {
    silent: false,
  },
};

// global API configuration
// 'X-Webitel-Access' ~ 'X-Access-Token'
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'X-Webitel-Access': localStorage.getItem('access-token') || '',
    // 'X-Webitel-Access': 'USER_TOKEN',
    // 'X-Webitel-Access': 'ITS_TOKEN',
  },
});

defaultInterceptorsSetup({ instance, config });

export default instance;
