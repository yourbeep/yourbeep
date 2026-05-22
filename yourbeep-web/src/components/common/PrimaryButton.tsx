import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import MainButton from "../ui/MainButton";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  variant?: "solid" | "outline";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const PrimaryButton = ({
  children,
  href,
  onClick,
  variant = "solid",
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
}: Props) => {
  const classNameForVariant =
    variant === "outline"
      ? "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5"
      : "bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)] text-white hover:opacity-90 active:scale-[0.99]";

  const shared = `inline-flex items-center justify-center px-5 py-3 text-sm font-semibold transition rounded-full ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${shared} ${classNameForVariant} ${disabled ? "pointer-events-none opacity-70" : ""}`}
      >
        {children}
      </a>
    );
  }

  return (
    <MainButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      variant={variant === "outline" ? "outline" : "primary"}
      className={className}
    >
      {children}
    </MainButton>
  );
};

export default PrimaryButton;
