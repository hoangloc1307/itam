import { format, type Locale } from 'date-fns';
import { enUS, ja, vi } from 'date-fns/locale';

const localeMap: Record<string, Locale> = {
  vi,
  en: enUS,
  jp: ja,
};

export function formatDate(date: string | Date, pattern = 'Pp', lang = 'vi') {
  return format(new Date(date), pattern, { locale: localeMap[lang] ?? vi });
}
