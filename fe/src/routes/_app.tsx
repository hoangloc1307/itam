import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { IconHome, IconInfoCircle, IconLogout } from '@tabler/icons-react';

const AppLayout = () => (
  <div className='flex min-h-screen'>
    {/* Sidebar */}
    <aside className='flex w-64 flex-col border-r border-gray-200 bg-white'>
      <div className='flex h-16 items-center border-b border-gray-200 px-6'>
        <span className='text-xl font-bold text-gray-900'>ITAM</span>
      </div>

      <nav className='flex-1 space-y-1 p-4'>
        <Link
          to='/dashboard'
          className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-700'
        >
          <IconHome size={20} />
          Dashboard
        </Link>
        <Link
          to='/about'
          className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 [&.active]:bg-blue-50 [&.active]:text-blue-700'
        >
          <IconInfoCircle size={20} />
          About
        </Link>
      </nav>

      <div className='border-t border-gray-200 p-4'>
        <Link
          to='/login'
          className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'
        >
          <IconLogout size={20} />
          Đăng xuất
        </Link>
      </div>
    </aside>

    {/* Main content */}
    <div className='flex flex-1 flex-col'>
      <header className='flex h-16 items-center border-b border-gray-200 bg-white px-6'>
        <h1 className='text-lg font-semibold text-gray-900'>IT Asset Management</h1>
      </header>

      <main className='flex-1 overflow-auto bg-gray-50 p-6'>
        <Outlet />
      </main>
    </div>
  </div>
);

export const Route = createFileRoute('/_app')({ component: AppLayout });
