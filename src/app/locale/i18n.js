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

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  allowComposition: true,
  messages,
  datetimeFormats,
});
