import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { LANGUAGES } from '~/constants/languages';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as keyof typeof LANGUAGES;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size={'icon-sm'} variant={'ghost'} title={t('changeLanguage')}>
            <Avatar className='size-5'>
              <AvatarImage src={LANGUAGES[currentLang].flag} alt={LANGUAGES[currentLang].label} />
              <AvatarFallback className='text-xs'>{currentLang.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align='end'>
        {Object.entries(LANGUAGES).map(([key, lang]) => (
          <DropdownMenuItem key={key} onClick={() => i18n.changeLanguage(key)}>
            <img src={lang.flag} alt={key} className='size-4 rounded-sm' />
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
