import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "primary" | "outline" | "ghost";
type IconButtonSize = "sm" | "md";

type IconButtonProps = {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)] text-white shadow-[0_10px_24px_rgba(39,107,115,0.2)]",
  outline:
    "border border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--surface)]",
  ghost: "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-soft)]",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9 rounded-full",
  md: "h-11 w-11 rounded-full",
};

export function IconButton({
  icon,
  variant = "outline",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center transition duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
    >
      {icon}
    </button>
  );
}

export default IconButton;
