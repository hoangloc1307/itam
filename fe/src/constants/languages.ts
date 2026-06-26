import flagEN from '~/assets/images/flag/en.svg';
import flagJP from '~/assets/images/flag/jp.svg';
import flagVI from '~/assets/images/flag/vi.svg';

export const LANGUAGES = {
  en: { label: 'English', flag: flagEN },
  jp: { label: '日本語', flag: flagJP },
  vi: { label: 'Tiếng Việt', flag: flagVI },
} as const;
