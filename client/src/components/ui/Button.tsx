import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const isChildrenText = (children: React.ReactNode) => {
  return React.Children.toArray(children).every(
    (child) => typeof child === "string" || typeof child === "number"
  );
};

const variantClasses = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-400",
  secondary:
    "bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-400",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
};

const Button = ({
  children,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all",
        isChildrenText(children) && variantClasses[variant],
        disabled && "bg-gray-300 text-gray-500 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
