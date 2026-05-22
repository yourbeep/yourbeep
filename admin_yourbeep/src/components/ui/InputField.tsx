import type { ChangeEvent, ReactNode } from "react";
import { FieldLabel } from "./FieldLabel";

type SelectOption = {
  label: string;
  value: string;
};

type SharedProps = {
  label: ReactNode;
  name?: string;
  value: string;
  placeholder?: string;
  helpText?: ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  endAdornment?: ReactNode;
};

type InputVariantProps =
  | {
      element?: "input";
      type?: "text" | "email" | "number" | "password" | "url";
      onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    }
  | {
      element: "textarea";
      rows?: number;
      onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    }
  | {
      element: "select";
      options: SelectOption[];
      onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    };

export type InputFieldProps = SharedProps & InputVariantProps;

const defaultInputClassName =
  "h-11 w-full rounded-xl border border-[#dfe8d6] bg-[#fbfcf8] px-3.5 text-sm text-[#203321] outline-none transition placeholder:text-[#91a08d] focus:border-[#0d6e6e] focus:bg-white focus:ring-2 focus:ring-[rgba(13,110,110,0.14)]";

export function InputField(props: InputFieldProps) {
  const {
    label,
    name,
    value,
    placeholder,
    helpText,
    className = "",
    inputClassName = "",
    labelClassName = "",
    disabled = false,
    endAdornment,
  } = props;

  const mergedClassName = `${defaultInputClassName} ${inputClassName}`.trim();

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div className={labelClassName}>
        <FieldLabel>{label}</FieldLabel>
      </div>

      {props.element === "textarea" ? (
        <textarea
          name={name}
          value={value}
          rows={props.rows ?? 6}
          placeholder={placeholder}
          onChange={props.onChange}
          disabled={disabled}
          className={`${mergedClassName} min-h-[180px] resize-y py-3`}
        />
      ) : props.element === "select" ? (
        <select
          name={name}
          value={value}
          onChange={props.onChange}
          disabled={disabled}
          className={mergedClassName}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            name={name}
            type={props.type ?? "text"}
            value={value}
            placeholder={placeholder}
            onChange={props.onChange}
            disabled={disabled}
            className={`${mergedClassName} ${endAdornment ? "pr-10" : ""}`.trim()}
          />
          {endAdornment ? (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8a74]">
              {endAdornment}
            </div>
          ) : null}
        </div>
      )}

      {helpText ? (
        <p className="text-xs leading-5 text-[#72806e]">{helpText}</p>
      ) : null}
    </div>
  );
}
