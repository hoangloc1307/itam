import { Skeleton } from '~/components/ui/skeleton';

export const PageSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton className='h-8 w-48' />
    <Skeleton className='h-4 w-96' />
    <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      <Skeleton className='h-24 rounded-xl' />
      <Skeleton className='h-24 rounded-xl' />
      <Skeleton className='h-24 rounded-xl' />
    </div>
  </div>
);
