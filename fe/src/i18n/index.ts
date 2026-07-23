import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { LANGUAGES } from '~/constants/languages';
import STORAGE_KEYS from '~/constants/storage-keys';

i18n
  .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'vi',
    supportedLngs: Object.keys(LANGUAGES),
    interpolation: {
      escapeValue: false,
    },
    ns: [
      'common',
      'asset',
      'auth',
      'category',
      'categoryAttribute',
      'attribute',
      'documentSequence',
      'feature',
      'model',
      'role',
      'rolePermission',
      'user',
      'userRole',
      'userPermission',
      'datatable',
    ],
    defaultNS: 'common',
    detection: {
      caches: ['localStorage'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
    },
  });

export default i18n;
