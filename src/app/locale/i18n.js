import { createI18n } from 'vue-i18n';

import datetimeFormats from './datetimeFormats.js';
import en from './en/en.js';
import kz from './kz/kz.js';
import ru from './ru/ru.js';
import ua from './ua/ua.js';

const messages = {
  en,
  ru,
  ua,
  kz,
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  datetimeFormats,
});

export default i18n;

