import { useEffect } from 'react';
import { applyTheme, useThemeStore } from '~/stores/theme';

export function useTheme() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [theme]);

  return { theme, setTheme };
}
