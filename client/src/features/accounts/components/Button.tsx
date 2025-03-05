type ButtonProps = {
  text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ text, ...buttonProps }: ButtonProps) => {
  return (
    <button
      className="py-2 px-8 rounded-full font-semibold bg-cyanBlue text-black hover:bg-cyanBlue-dark active:bg-cyanBlue-darker disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed "
      {...buttonProps}
    >
      {text}
    </button>
  );
};
export default Button;
