import { createFileRoute, Outlet } from '@tanstack/react-router';

const AuthLayout = () => (
  <div className='flex min-h-screen items-center justify-center bg-gray-50'>
    <div className='w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg'>
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/_auth')({ component: AuthLayout });
