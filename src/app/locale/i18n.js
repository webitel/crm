import { createI18n } from 'vue-i18n';

import datetimeFormats from './datetimeFormats.js';
import en from './en/en.js';
import es from './es/es.js';
import kz from './kz/kz.js';
import ro from './ro/ro.js';
import ru from './ru/ru.js';
import uk from './uk/uk.js';
import pl from './pl/pl.js';
import uz from './uz/uz.js';
import vi from './vi/vi.js';

const messages = {
  en,
  es,
  ru,
  ro,
  uk,
  kz,
  pl,
  uz,
  vi,
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  datetimeFormats,
});

export default i18n;
