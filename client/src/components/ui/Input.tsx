import { FaExclamationCircle } from "react-icons/fa";
import Helptext from "./Helptext";
import Errortext from "./Errortext";
import React from "react";

type InputPropsv1 = {
  error?: string | string[];
  helpText?: string | string[];
  labelText: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ error, helpText, labelText, ...inputProps }: InputPropsv1) => {
  const { name, required, type } = inputProps;
  const inputType = type || "text";

  return (
    <div>
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor={name}
      >
        {labelText}
        {required && "*"}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          type={inputType}
          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none ${
            error
              ? "border-2 border-red-500 focus:ring focus:ring-red-200 focus:border-red-500"
              : "border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
          }`}
        />
        {error && (
          <span
            className={`absolute ${
              ["text", "email", "number", "file"].includes(inputType)
                ? "right-2"
                : "right-10"
            } top-1/2 transform -translate-y-1/2 text-red-500`}
          >
            <FaExclamationCircle />
          </span>
        )}
      </div>
      {helpText && !error && <Helptext text={helpText} />}
      {error && <Errortext text={error} />}
    </div>
  );
};

export default Input;
