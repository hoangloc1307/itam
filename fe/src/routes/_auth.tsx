import { createFileRoute, Outlet } from '@tanstack/react-router';
import banner from '~/assets/images/banner.png';
import { Card, CardContent } from '~/components/ui/card';

const AuthLayout = () => (
  <div className='bg-muted flex min-h-svh items-center justify-center p-6 md:p-10'>
    <div className='w-full max-w-sm md:max-w-4xl'>
      <div className='flex flex-col gap-6'>
        <Card className='overflow-hidden p-0'>
          <CardContent className='grid p-0 md:grid-cols-2'>
            <div className='hidden rounded-l-sm bg-primary/15 md:block'>
              <img src={banner} alt='Banner' className='h-full w-full object-contain' />
            </div>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export const Route = createFileRoute('/_auth')({ component: AuthLayout });
