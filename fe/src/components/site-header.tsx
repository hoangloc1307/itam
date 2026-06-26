import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '~/components/language-switcher';
import { ThemeToggle } from '~/components/theme-toggle';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger, useSidebar } from '~/components/ui/sidebar';
import UserOption from '~/components/user-option';

export function SiteHeader() {
  const { t } = useTranslation();
  const { open } = useSidebar();

  return (
    <header className='bg-background sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4'>
        <SidebarTrigger className='-ml-1' title={t(`${open ? 'hideSidebar' : 'showSidebar'}`)} />
        <div className='ml-auto flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
          <Separator orientation='vertical' className='mx-2' />
          <UserOption />
        </div>
      </div>
    </header>
  );
}
