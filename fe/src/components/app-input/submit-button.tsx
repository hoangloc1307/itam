import type { ReactNode } from 'react';
import { Button } from '~/components/ui/button';
import { useFormContext } from '~/hooks/use-app-form';

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

export const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type='submit' className={className} disabled={!canSubmit || isSubmitting}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};
