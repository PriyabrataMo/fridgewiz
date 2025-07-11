import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 focus:ring-green-500 shadow-sm hover:shadow-md",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-400",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-400",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-400",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
