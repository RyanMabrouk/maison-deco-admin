'use client';

import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string[];
  className?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      name,
      placeholder,
      defaultValue,
      disabled,
      error,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isDisabled = defaultValue === '' || disabled;

    return (
      <div className={cn('password-input-container')}>
        <label className="block font-semibold">{label}</label>
        <div className="relative">
          {/* Input field */}
          <input
            type={showPassword ? 'text' : 'password'}
            name={name}
            className={cn(
              'mt-2 w-full rounded-sm border border-gray-300 p-2 pl-2 pr-12 focus:outline-none focus:ring-2 focus:ring-color2',
              className
            )}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled={disabled}
            ref={ref}
            {...props}
          />

          {/* Eye button for toggling visibility */}
          <button
            type="button"
            className="absolute right-2 top-[60%] -translate-y-1/2 transform rounded-sm p-1 hover:bg-color3"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isDisabled}
          >
            {showPassword && !isDisabled ? (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            </span>
          </button>
        </div>

        {/* Display error messages */}
        {error?.map((err, index) => (
          <p key={index} className="mt-2 text-red-500">
            {err}
          </p>
        ))}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
