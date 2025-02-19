import { config } from '@vue/test-utils';
import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock'; // import instance from '../../src/app/api/instance.js';

import i18n from '../../src/app/locale/i18n';
import WebitelUi from '../../src/app/plugins/webitel-ui';

config.global.plugins = [WebitelUi, i18n];

window.scrollTo = () => {};

const axios = axiosMock();
vi.doMock('@webitel/ui-sdk/src/api/axios/generateInstance.js', () => ({
  default: () => axios().default,
}));

beforeAll(async () => {
  const store = (await import('../../src/app/store/index.js')).default;
  const router = (await import('../../src/app/router/index.js')).default;
  store.commit('SET_ROUTER', router);
});

