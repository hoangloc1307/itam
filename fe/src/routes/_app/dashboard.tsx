import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

// Fake API call với delay 2s để test Suspense
const fetchDashboardStats = () =>
  new Promise<{ total: number; inUse: number; maintenance: number }>((resolve) =>
    setTimeout(() => resolve({ total: 128, inUse: 96, maintenance: 7 }), 2000),
  );

const dashboardStatsOptions = queryOptions({
  queryKey: ['dashboard-stats'],
  queryFn: fetchDashboardStats,
});

const DashboardPage = () => {
  const { data } = useSuspenseQuery(dashboardStatsOptions);

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900'>Dashboard</h2>
      <p className='mt-2 text-gray-600'>Chào mừng bạn đến với hệ thống quản lý tài sản IT.</p>

      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-xl border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-500'>Tổng tài sản</p>
          <p className='mt-1 text-3xl font-bold text-gray-900'>{data.total}</p>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-500'>Đang sử dụng</p>
          <p className='mt-1 text-3xl font-bold text-gray-900'>{data.inUse}</p>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-500'>Bảo trì</p>
          <p className='mt-1 text-3xl font-bold text-gray-900'>{data.maintenance}</p>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_app/dashboard')({ component: DashboardPage });
