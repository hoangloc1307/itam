import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTheme } from '~/hooks/use-theme';

const RootLayout = () => {
  useTheme();

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
