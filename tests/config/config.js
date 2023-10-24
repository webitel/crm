import { config } from '@vue/test-utils';
import mockAxios from 'jest-mock-axios';
import WebitelUi from '../../src/app/plugins/webitel-ui';
import i18n from '../../src/app/locale/i18n';

config.global.plugins = [WebitelUi, i18n];

window.scrollTo = () => {};

jest.mock('axios', () => mockAxios);

