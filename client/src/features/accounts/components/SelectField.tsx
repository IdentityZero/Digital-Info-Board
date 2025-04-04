import React from "react";
import { Errortext, Helptext } from "../../../components/ui";

type SelectFieldProps = {
  labelText: string;
  children: React.ReactNode;
  error?: string | string[];
  helpText?: string | string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = ({
  error,
  labelText,
  children,
  helpText,
  ...selectProps
}: SelectFieldProps) => {
  return (
    <div>
      <div className="flex flex-row items-center rounded-md overflow-hidden">
        <label
          className="bg-desaturatedBlueGray py-3 px-2 font-bold w-[150px] lg:w-[180px]"
          htmlFor={labelText}
        >
          {labelText}
        </label>
        <select
          id={labelText}
          className="flex-1 bg-gray-200 py-3 pl-2 capitalize"
          {...selectProps}
        >
          {children}
        </select>
      </div>
      {error && <Errortext text={error} />}
      {helpText && <Helptext text={helpText} />}
    </div>
  );
};
export default SelectField;
