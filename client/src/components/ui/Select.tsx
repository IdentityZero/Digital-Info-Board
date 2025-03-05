import { FaExclamationCircle } from "react-icons/fa";

import { selectOptionFormatString } from "../../utils";
import Helptext from "./Helptext";
import Errortext from "./Errortext";
import React from "react";

type SelectProps = {
  options: string[];
  labelText: string;
  error?: string | string[];
  helpText?: string | string[];
  onChangeFunc?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({
  labelText,
  options,
  error,
  helpText,
  onChangeFunc,
  ...selectProps
}: SelectProps) => {
  const { name, required } = selectProps;

  const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChangeFunc) {
      onChangeFunc(e);
    }
  };

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
        <select
          onChange={handleSelectOnChange}
          {...selectProps}
          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed ${
            error
              ? "border-2 border-red-500 focus:ring focus:ring-red-200 focus:border-red-500"
              : "border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {selectOptionFormatString(option)}
            </option>
          ))}
        </select>
        {error && (
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle />
          </span>
        )}
      </div>
      {helpText && !error && <Helptext text={helpText} />}
      {error && <Errortext text={error} />}
    </div>
  );
};
export default Select;
