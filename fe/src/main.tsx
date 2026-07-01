import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import { PageSkeleton } from '~/components/page-skeleton';
import i18n from '~/i18n';
import '~/index.css';
import { routeTree } from '~/routeTree.gen';

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.isAxiosError) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  const message = event.reason instanceof Error ? event.reason.message : i18n.t('error.unknown');
  toast.error(message);
});

const router = createRouter({
  routeTree,
  defaultPendingComponent: PageSkeleton,
  defaultPendingMinMs: 200,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
    </StrictMode>,
  );
}
