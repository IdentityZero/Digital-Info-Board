import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClickFunc?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
};

const isChildrenText = (children: React.ReactNode) => {
  return React.Children.toArray(children).every(
    (child) => typeof child === "string" || typeof child === "number"
  );
};

const Button = ({
  type = "button",
  disabled = false,
  children,
  ...props
}: ButtonProps) => {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "button" && props.onClickFunc) {
      props.onClickFunc(e);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleButtonClick}
      className={`${
        isChildrenText(children)
          ? disabled
            ? "py-2 px-4 rounded bg-gray-300 text-gray-500 cursor-not-allowed"
            : "py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          : ""
      }`}
    >
      {children}
    </button>
  );
};
export default Button;
