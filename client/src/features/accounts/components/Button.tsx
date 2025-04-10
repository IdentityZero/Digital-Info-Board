type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant = "primary", text, ...buttonProps }: ButtonProps) => {
  const variantClasses = {
    primary: "bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker",
    secondary:
      "bg-btSecondary hover:bg-btSecondary-hover active:bg-btSecondary-active",
    danger: "bg-btDanger hover:bg-btDanger-hover active:bg-btDanger-active",
  };

  return (
    <button
      className={`py-2 px-4 sm:px-6 md:px-8 text-sm sm:text-base rounded-full font-semibold text-black
                  ${variantClasses[variant]} 
                  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed w-full sm:w-auto`}
      {...buttonProps}
    >
      {text}
    </button>
  );
};
export default Button;
