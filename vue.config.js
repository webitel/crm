const { defineConfig } = require('@vue/cli-service');

process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'https://dev.webitel.com/api';

process.env.VUE_APP_AUTH_MODULE_URL = process.env.NODE_ENV === 'production'
  ? '/app/auth'
  : 'https://dev.webitel.com/app/auth';
process.env.VUE_APP_ADMIN_URL = process.env.NODE_ENV === 'production'
  ? '/admin'
  : 'https://dev.webitel.com/admin';
process.env.VUE_APP_AGENT_URL = process.env.NODE_ENV === 'production'
  ? '/workspace'
  : 'https://dev.webitel.com/workspace';
process.env.VUE_APP_SUPERVISOR_URL = process.env.NODE_ENV === 'production'
  ? '/supervisor'
  : 'https://dev.webitel.com/supervisor';
process.env.VUE_APP_AUDIT_URL = process.env.NODE_ENV === 'production'
  ? '/audit'
  : 'https://dev.webitel.com/audit';
process.env.VUE_APP_HISTORY_URL = process.env.NODE_ENV === 'production'
  ? '/history'
  : 'https://dev.webitel.com/history';
process.env.VUE_APP_CRM_URL = process.env.NODE_ENV === 'production'
  ? '/crm'
  : 'https://dev.webitel.com/crm';
process.env.VUE_APP_GRAFANA_URL = process.env.NODE_ENV === 'production'
  ? '/grafana'
  : 'https://dev.webitel.com/grafana';
process.env.VUE_APP_SETTINGS_URL = process.env.NODE_ENV === 'production'
  ? '/settings'
  : 'https://dev.webitel.com/settings';
process.env.VUE_APP_APPLICATION_HUB_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : 'https://dev.webitel.com/';

process.env.VUE_APP_PACKAGE_VERSION = require('./package.json').version;

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/crm',
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/app/css/main.scss";
        `,
      },
    },
  },

  chainWebpack: (config) => {
    config.plugin('polyfills')
    .use(new NodePolyfillPlugin({ includeAliases: ['process'] }));

    config.resolve.alias.set('vue', '@vue/compat');

    config.module
    .rule('svg')
    .exclude.add(/^(.*sprite).*\.svg/); // same as in svg-sprite-loader

    config.module
    .rule('svg-sprite')
    .test(/^(.*sprite).*\.svg/) // same as in svg-url-loader
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader');
  },
});
