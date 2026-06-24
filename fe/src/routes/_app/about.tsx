import { createFileRoute } from '@tanstack/react-router';

const AboutPage = () => (
  <div>
    <h2 className='text-2xl font-bold text-gray-900'>About</h2>
    <p className='mt-2 text-gray-600'>
      Hệ thống quản lý tài sản CNTT (IT Asset Management) giúp theo dõi và quản lý toàn bộ tài sản
      công nghệ thông tin trong tổ chức.
    </p>
  </div>
);

export const Route = createFileRoute('/_app/about')({ component: AboutPage });
