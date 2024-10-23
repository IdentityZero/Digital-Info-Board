import { FaExclamationCircle } from "react-icons/fa";

import { selectOptionFormatString } from "../../utils";
import Helptext from "./Helptext";
import Errortext from "./Errortext";

type SelectProps = {
  options: string[];
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  error?: string | string[];
  helpText?: string | string[];
  onChangeFunc?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select = ({ required = false, options, ...props }: SelectProps) => {
  const { name, label } = props;

  const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.onChangeFunc) {
      props.onChangeFunc(e);
    }
  };

  return (
    <div>
      <label
        className="block text-gray-700 text-sm font-bold mb-2 capitalize"
        htmlFor={name}
      >
        {label}
        {required && "*"}
      </label>
      <div className="relative">
        <select
          onChange={handleSelectOnChange}
          name={name}
          value={props.defaultValue}
          required={required}
          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none ${
            props.error
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
        {props.error && (
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle />
          </span>
        )}
      </div>
      {props.helpText && !props.error && <Helptext text={props.helpText} />}
      {props.error && <Errortext text={props.error} />}
    </div>
  );
};
export default Select;
