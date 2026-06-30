import i18next from 'i18next';
import en from '~/i18n/locales/en.json';
import vi from '~/i18n/locales/vi.json';

const SUPPORTED_LANGUAGES = ['vi', 'en'];

i18next.init({
  lng: 'vi',
  fallbackLng: 'vi',
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ['common', 'auth'],
  defaultNS: 'common',
  resources: {
    en: { common: en.common, auth: en.auth },
    vi: { common: vi.common, auth: vi.auth },
  },
  interpolation: {
    escapeValue: false,
  },
});

export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options);
}

export function changeLanguage(lng: string) {
  return i18next.changeLanguage(lng);
}

export { SUPPORTED_LANGUAGES };
export default i18next;
