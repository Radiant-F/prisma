import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  registration?: UseFormRegisterReturn;
  error?: string;
}

export default function FormInput({
  id,
  label,
  registration,
  error,
  className,
  ...inputProps
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium theme-muted block ml-1"
      >
        {label}
      </label>
      <input
        id={id}
        {...registration}
        {...inputProps}
        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 hover:bg-[var(--ghost-hover)] disabled:opacity-70 disabled:cursor-not-allowed theme-input theme-placeholder ${className ?? ""}`}
      />
      {error && (
        <p className="text-xs text-red-600 ml-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
