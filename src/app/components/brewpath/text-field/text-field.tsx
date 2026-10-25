import type { InputHTMLAttributes } from 'react';

type ForwardedInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'id' | 'autoComplete' | 'required' | 'aria-invalid' | 'aria-describedby'
>;

export interface TextFieldProps extends ForwardedInputProps {
  /** Current text; the field is controlled. */
  value: string;
  /** Called with the new text on every keystroke. */
  onChange: (value: string) => void;
  /** Muted hint while empty, e.g. "you@example.com". */
  placeholder?: string;
  /** Spoken name of the field, for a field without a visible <label>. */
  ariaLabel?: string;
}

/** The one free-text input: surface fill, rule border, 12px radius; focus turns the border accent. */
export function TextField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  type = 'text',
  ...inputProps
}: TextFieldProps) {
  return (
    <div className="flex items-center rounded-xl border border-rule bg-surface px-4 py-3.25 transition-[border-color] duration-140 ease-in-out focus-within:border-accent">
      <input
        {...inputProps}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 appearance-none border-none bg-transparent font-ui text-body text-ink outline-none"
      />
    </div>
  );
}
