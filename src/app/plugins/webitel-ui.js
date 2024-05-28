import WebitelUI from '@webitel/ui-sdk/dist/ui-sdk.js';
import WebitelUIEn from '@webitel/ui-sdk/src/locale/en/en.js';
import WebitelUIKz from '@webitel/ui-sdk/src/locale/kz/kz.js';
import WebitelUIRu from '@webitel/ui-sdk/src/locale/ru/ru.js';
import WebitelUIUa from '@webitel/ui-sdk/src/locale/ua/ua.js';
import eventBus from '@webitel/ui-sdk/src/scripts/eventBus.js';
import i18n from '../locale/i18n.js';
import '@webitel/ui-sdk/dist/ui-sdk.css';

const globals = {
  $baseURL: import.meta.env.BASE_URL,
};

i18n.global.mergeLocaleMessage('en', WebitelUIEn);
i18n.global.mergeLocaleMessage('ru', WebitelUIRu);
i18n.global.mergeLocaleMessage('ua', WebitelUIUa);
i18n.global.mergeLocaleMessage('kz', WebitelUIKz);

export default [WebitelUI, { eventBus, globals }];
