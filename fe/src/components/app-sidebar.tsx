import { Link } from '@tanstack/react-router';
import { NavMain } from '~/components/nav-main';
import { NavSecondary } from '~/components/nav-secondary';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import MENU from '~/configs/menu';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props} collapsible='offcanvas'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' render={<Link to='/' />}>
              <div className='flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground'>
                <img src='/favicon.svg' alt='Logo' className='size-10' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>IT Asset Management</span>
                <span className='truncate text-xs'>v0.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MENU.MAIN_MENU} />
        <NavSecondary items={MENU.SECONDARY_MENU} className='mt-auto' />
      </SidebarContent>
    </Sidebar>
  );
}
