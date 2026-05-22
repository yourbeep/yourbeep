import { clsx, type ClassValue } from "clsx";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FiEye, FiEyeOff, FiLoader, FiSearch } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

type InputVariant = "default" | "filled" | "outline" | "searchbar";
type InputSize = "sm" | "md" | "lg";
type InputType = "text" | "email" | "password" | "search" | "number";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MainInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  label?: string;
  hint?: string;
  error?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  inputType?: InputType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  isLoading?: boolean;
  showPasswordToggle?: boolean;
}

const INPUT_VARIANTS: Record<InputVariant, string> = {
  default:
    "bg-[#F3F4F6] border border-transparent text-[#1F2937] placeholder:text-[#6B7280] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10",

  filled:
    "bg-[#F8FAFC] border border-[#E5E7EB] text-[#1F2937] placeholder:text-[#6B7280] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10",

  outline:
    "bg-white border border-[#C8D0DD] text-[#1F2937] placeholder:text-[#6B7280] focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10",

  searchbar:
    "bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F2937] placeholder:text-[#6B7280] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10 rounded-full",
};

const INPUT_SIZES: Record<InputSize, string> = {
  sm: "h-9 text-sm rounded-lg px-3",
  md: "h-11 text-sm rounded-xl px-4",
  lg: "h-12 text-base rounded-xl px-4",
};

export function MainInput({
  label,
  hint,
  error,
  variant = "default",
  inputSize = "md",
  inputType = "text",
  leftIcon,
  rightIcon,
  wrapperClassName,
  inputClassName,
  labelClassName,
  isLoading = false,
  showPasswordToggle = true,
  className,
  ...props
}: MainInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputType === "password";
  const resolvedType =
    isPassword && showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : inputType;

  const hasLeft = !!leftIcon || inputType === "search";
  const hasRight =
    !!rightIcon || isLoading || (isPassword && showPasswordToggle);

  return (
    <div className={cn("flex w-full flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.12em] text-[#4B5563]",
            labelClassName,
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {(inputType === "search" || leftIcon) && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#6B7280]">
            {leftIcon ?? <FiSearch className="h-4 w-4" />}
          </span>
        )}

        <input
          type={resolvedType}
          className={cn(
            "w-full transition-all duration-200 outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "focus-visible:outline-none",
            INPUT_VARIANTS[variant],
            INPUT_SIZES[inputSize],
            hasLeft && "pl-10",
            hasRight && "pr-11",
            error &&
              "border-[#D93025] focus:border-[#D93025] focus:ring-[#D93025]/10",
            inputClassName,
            className,
          )}
          {...props}
        />

        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            <FiLoader className="h-4 w-4 animate-spin" />
          </span>
        )}

        {!isLoading && rightIcon && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {rightIcon}
          </span>
        )}

        {!isLoading && isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition hover:text-[#374151]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="h-4 w-4" />
            ) : (
              <FiEye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-[#D93025]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#6B7280]">{hint}</p>
      ) : null}
    </div>
  );
}

/** Alias for imports named `CustomInput`. */
export { MainInput as CustomInput };

/** Preset {@link MainInput} for dense admin forms (e.g. settings). */
export function FormTextField({
  name,
  defaultValue,
  type = "text",
}: {
  name: string;
  defaultValue?: string | number;
  type?: string;
}) {
  return (
    <MainInput
      name={name}
      defaultValue={
        defaultValue === undefined || defaultValue === null
          ? undefined
          : String(defaultValue)
      }
      inputType={type === "number" ? "number" : "text"}
      variant="filled"
      inputSize="sm"
      className="text-[12px]"
      wrapperClassName="gap-1"
    />
  );
}
