import { FaExclamationCircle } from "react-icons/fa";
import Helptext from "./Helptext";
import Errortext from "./Errortext";
import { useState } from "react";

type DurationInputProps = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  error?: string | string[];
  helpText?: string | string[];
  disabled?: boolean;
};

const DurationInput = ({
  required = false,
  disabled = false,
  ...props
}: DurationInputProps) => {
  const [value, setValue] = useState("00:00:40");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor={props.name}
      >
        {props.label}
        {required && "*"}
      </label>
      <div className="relative">
        <input
          type="number"
          id={props.name}
          name={props.name}
          disabled={disabled}
          required={required}
          value={value}
          onChange={handleValueChange}
          placeholder={props.placeholder}
          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none ${
            props.error
              ? "border-2 border-red-500 focus:ring focus:ring-red-200 focus:border-red-500"
              : "border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
          }`}
        />
        {props.error && (
          <span
            className={`absolute top-1/2 transform right-2 -translate-y-1/2 text-red-500`}
          >
            <FaExclamationCircle />
          </span>
        )}
      </div>
      {props.helpText && !props.error && <Helptext text={props.helpText} />}
      {props.error && <Errortext text={props.error} />}
    </div>
  );
};
export default DurationInput;
