import { createFileRoute, Link } from '@tanstack/react-router';

const LoginPage = () => (
  <>
    <div className='text-center'>
      <h1 className='text-2xl font-bold text-gray-900'>Đăng nhập</h1>
      <p className='mt-2 text-sm text-gray-600'>Chào mừng bạn quay trở lại</p>
    </div>

    <form className='space-y-4'>
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email
        </label>
        <input
          id='email'
          type='email'
          placeholder='you@example.com'
          className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
        />
      </div>

      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Mật khẩu
        </label>
        <input
          id='password'
          type='password'
          placeholder='••••••••'
          className='mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
        />
      </div>

      <Link
        to='/dashboard'
        className='block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700 transition-colors'
      >
        Đăng nhập
      </Link>
    </form>

    <p className='text-center text-sm text-gray-600'>
      Chưa có tài khoản?{' '}
      <Link to='/register' className='font-medium text-blue-600 hover:text-blue-500'>
        Đăng ký
      </Link>
    </p>
  </>
);

export const Route = createFileRoute('/_auth/login')({ component: LoginPage });
