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
  /**
   * Example
   * <SelectField
            labelText="Role"
            name="role"
            onChange={handleChange}
            required
            value={formData.role}
            disabled={isSaving}
            error={error.role}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option value={role} className="capitalize" key={role}>
                {role}
              </option>
            ))}
          </SelectField>
   */
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-md overflow-hidden w-full border-2 border-desaturatedBlueGray ">
        <label
          className="bg-desaturatedBlueGray px-2 py-2 sm:py-3 text-sm sm:text-base font-bold w-full sm:w-[150px] lg:w-[180px]"
          htmlFor={labelText}
        >
          {labelText}
        </label>
        <select
          id={labelText}
          className="flex-1 bg-gray-200 px-2 py-2 sm:py-3 capitalize text-sm sm:text-base disabled:cursor-not-allowed"
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
