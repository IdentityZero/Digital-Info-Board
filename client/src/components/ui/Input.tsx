import { FaExclamationCircle } from "react-icons/fa";
import Helptext from "./Helptext";
import Errortext from "./Errortext";

type ControlledInputProps = {
  ctrl_type: "controlled";
  inputValue: string;
  setInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type FileControlledInputProps = {
  ctrl_type: "file-controlled";
  setInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type UnControlledInputProps = {
  ctrl_type: "uncontrolled";
};

type BaseInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | string[];
  helpText?: string | string[];
  disabled?: boolean;
};

type InputProps = (
  | ControlledInputProps
  | UnControlledInputProps
  | FileControlledInputProps
) &
  BaseInputProps;

const Input = ({
  type = "text",
  required = false,
  disabled = false,
  ...props
}: InputProps) => {
  const { ctrl_type, label, name } = props;

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
        <input
          type={type}
          id={name}
          name={name}
          disabled={disabled}
          accept="image/*" // TODO. CONDITIONAL. MASADOT NAK MANG KUTI
          required={required}
          {...(ctrl_type === "controlled"
            ? {
                value: props.inputValue,
                onChange: (e) => props.setInputValue(e),
              }
            : {})}
          {...(ctrl_type === "file-controlled"
            ? {
                onChange: (e) => props.setInputValue(e),
              }
            : {})}
          placeholder={props.placeholder}
          className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none ${
            props.error
              ? "border-2 border-red-500 focus:ring focus:ring-red-200 focus:border-red-500"
              : "border border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
          }`}
        />
        {props.error && (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle />
          </span>
        )}
      </div>
      {props.helpText && !props.error && <Helptext text={props.helpText} />}
      {props.error && <Errortext text={props.error} />}
    </div>
  );
};

export default Input;
