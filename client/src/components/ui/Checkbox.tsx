import React from "react";
import Helptext from "./Helptext";
import Errortext from "./Errortext";

type CheckboxProps = {
  error?: string | string[];
  helpText?: string | string[];
  labelText: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = ({
  error,
  helpText,
  labelText,
  ...inputProps
}: CheckboxProps) => {
  const { name, required } = inputProps;

  return (
    <div className="flex flex-col">
      <div className="flex items-start">
        <div className="relative flex items-center">
          <input
            id={name}
            {...inputProps}
            type="checkbox"
            className={`h-5 w-5 cursor-pointer text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200 focus:outline-none ${
              error ? "border-red-500 focus:ring-red-200" : ""
            }`}
          />
        </div>
        <label
          htmlFor={name}
          className={`ml-2 text-sm cursor-pointer ${
            error ? "text-red-600" : "text-gray-700"
          }`}
        >
          {labelText} {required && "*"}
        </label>
      </div>
      {helpText && !error && <Helptext text={helpText} />}
      {error && <Errortext text={error} />}
    </div>
  );
};

export default Checkbox;
