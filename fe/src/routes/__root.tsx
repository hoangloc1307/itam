import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTheme } from '~/hooks/use-theme';

const queryClient = new QueryClient();

const RootLayout = () => {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
