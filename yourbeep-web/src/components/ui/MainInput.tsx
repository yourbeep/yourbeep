import type { InputHTMLAttributes, ReactNode } from "react";

type MainInputProps = {
  label?: string;
  hint?: string;
  endAdornment?: ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function MainInput({
  label,
  hint,
  endAdornment,
  wrapperClassName = "",
  inputClassName = "",
  ...props
}: MainInputProps) {
  return (
    <div className={`flex flex-col gap-2 ${wrapperClassName}`.trim()}>
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          {...props}
          className={`h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:bg-[var(--surface)] ${endAdornment ? "pr-12" : ""} ${inputClassName}`.trim()}
        />
        {endAdornment ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export default MainInput;
