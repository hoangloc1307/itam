import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

const SUPPORTED_LANGUAGES = ['vi', 'en'];

i18next.use(Backend).init({
  // @ts-expect-error initImmediate is valid but missing from types
  initImmediate: false,
  lng: 'vi',
  fallbackLng: 'vi',
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: [
    'common',
    'asset',
    'auth',
    'attribute',
    'attributeGroup',
    'category',
    'feature',
    'model',
    'role',
    'rolePermission',
    'user',
    'userPermission',
    'userRole',
  ],
  defaultNS: 'common',
  backend: {
    loadPath: path.join(import.meta.dirname, 'locales/{{lng}}/{{ns}}.json'),
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
