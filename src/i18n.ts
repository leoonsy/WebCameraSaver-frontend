import { createI18n } from 'vue-i18n';
import ru from '@/i18n/ru.json';
import pluralRules from '@/i18n/pluralRules';
import storage from '@/utils/storage';

const locales = ['en', 'ru'];
const fallbackLocale = 'ru';
const storageLocale = storage.get('locale') ?? fallbackLocale;

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,

  locale: storageLocale,
  fallbackLocale,

  messages: { ru },
  pluralRules,
});

const setLocale = (locale: string) => {
  i18n.global.locale.value = locale;
  storage.set('locale', locale);
};

document.querySelector('html')?.setAttribute('lang', i18n.global.locale.value);

export default i18n;

export {
  locales,
  setLocale,
};
