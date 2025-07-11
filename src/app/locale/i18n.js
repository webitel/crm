import { createI18n } from 'vue-i18n';

import datetimeFormats from './datetimeFormats.js';
import en from './en/en.js';
import kz from './kz/kz.js';
import ru from './ru/ru.js';
import uk from './uk/uk.js';

const messages = {
  en,
  ru,
  uk,
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
