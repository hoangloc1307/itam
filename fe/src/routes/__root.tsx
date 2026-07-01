import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet, type ErrorComponentProps } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Toaster } from '~/components/ui/sonner';
import { useTheme } from '~/hooks/use-theme';

const queryClient = new QueryClient();

const RootLayout = () => {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position='top-right' richColors closeButton />
      <TanStackRouterDevtools position='bottom-right' />
    </QueryClientProvider>
  );
};

const RootErrorComponent = ({ error, reset }: ErrorComponentProps) => {
  const { t } = useTranslation('common');

  return (
    <div className='flex h-screen items-center justify-center p-4'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>{t('error.title')}</h1>
        <p className='text-muted-foreground mt-2 max-w-md'>{error.message}</p>
        <div className='mt-6 flex justify-center gap-3'>
          <Button variant='outline' onClick={reset}>
            {t('error.retry')}
          </Button>
          <Button onClick={() => (window.location.href = '/')}>{t('error.goHome')}</Button>
        </div>
      </div>
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: RootErrorComponent,
});
