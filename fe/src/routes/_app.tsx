import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '~/components/app-sidebar';
import { SiteHeader } from '~/components/site-header';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import { isAuthenticated } from '~/lib/auth';

const AppLayout = () => (
  <SidebarProvider>
    <AppSidebar variant='inset' />
    <SidebarInset>
      <SiteHeader />
      <div className='flex-1 p-4'>
        <Outlet />
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppLayout,
});
