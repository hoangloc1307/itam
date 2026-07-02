import { Link, useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const NotFound = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <main className='bg-background grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <img src='/favicon.svg' alt='Logo' className='mx-auto mb-8 size-12' />
        <p className='text-primary text-base font-semibold'>{t('notFound.code')}</p>
        <h1 className='text-foreground mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl'>
          {t('notFound.title')}
        </h1>
        <p className='text-muted-foreground mt-6 text-lg font-medium text-pretty sm:text-xl/8'>
          {t('notFound.description')}
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link
            to='/'
            className='bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:outline-primary rounded-md px-4 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            {t('notFound.goHome')}
          </Link>
          <button
            type='button'
            onClick={() => router.history.back()}
            className='text-foreground text-sm font-semibold'
          >
            {t('notFound.contactSupport')} <span aria-hidden='true'>&rarr;</span>
          </button>
        </div>
      </div>
    </main>
  );
};
