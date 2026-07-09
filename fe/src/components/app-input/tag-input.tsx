import { IconX } from '@tabler/icons-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/hooks/use-app-form';

type TagInputProps = {
  label?: string;
  placeholder?: string;
};

export const TagInput = ({ label, placeholder }: TagInputProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string[] | null>();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const tags = field.state.value ?? [];

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    field.handleChange([...tags, trimmed]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index);
    field.handleChange(updated.length > 0 ? updated : null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div
        className='border-input focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2.5 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:ring-3'
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <Badge key={index} variant='secondary' className='gap-1'>
            {tag}
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-4 rounded-full'
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
            >
              <IconX className='size-3' />
            </Button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          id={id}
          className='h-auto min-w-[80px] flex-1 border-0 p-0 shadow-none focus-visible:ring-0'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            addTag(inputValue);
            field.handleBlur();
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          aria-invalid={isInvalid}
        />
      </div>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
