import { FaExclamationCircle } from "react-icons/fa";
import Helptext from "./Helptext";
import Errortext from "./Errortext";

/**
 * Input component for handling controlled, uncontrolled, and file-controlled input types.
 *
 * @param {Object} props - The props object.
 * @param {"controlled"|"file-controlled"|"uncontrolled"} props.ctrl_type - Specifies the control type of the input.
 *    - `"controlled"`: For controlled inputs with value and onChange handler.
 *    - `"file-controlled"`: For file inputs with onChange handler.
 *    - `"uncontrolled"`: For uncontrolled inputs.
 * @param {string} props.label - The label text displayed above the input field.
 * @param {string} props.name - The name attribute for the input, often used in form submissions.
 * @param {string} [props.type="text"] - The input type (e.g., "text", "email", "password"). Defaults to "text".
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @param {boolean} [props.required=false] - Marks the input as required. Defaults to false.
 * @param {boolean} [props.disabled=false] - Disables the input field if set to true. Defaults to false.
 * @param {string|string[]} [props.error] - Error text displayed when there is an issue. Can be a string or an array of strings.
 * @param {string|string[]} [props.helpText] - Optional help text displayed below the input.
 * @param {function} [props.setInputValue] - Function to update the input value, required for controlled and file-controlled inputs.
 * @param {string} [props.inputValue] - The current value of the controlled input.
 *
 * @returns {JSX.Element} - The rendered input component with error and help text handling.
 *
 * @example
 * // Controlled input example
 * <Input
 *   ctrl_type="controlled"
 *   label="Username"
 *   name="username"
 *   inputValue={username}
 *   setInputValue={(e) => setUsername(e.target.value)}
 *   required={true}
 *   error="Username is required"
 * />
 *
 * @example
 * // Uncontrolled input example
 * <Input
 *   ctrl_type="uncontrolled"
 *   label="Email"
 *   name="email"
 *   placeholder="Enter your email"
 * />
 *
 * @example
 * // File-controlled input example
 * <Input
 *   ctrl_type="file-controlled"
 *   label="Upload Image"
 *   name="image"
 *   type="file"
 *   setInputValue={(e) => handleFileUpload(e.target.files)}
 * />
 */

type ControlledInputProps = {
  ctrl_type: "controlled";
  inputValue: string;
  setInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type FileControlledInputProps = {
  ctrl_type: "file-controlled";
  acceptedFormats?: string;
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
                accept: props.acceptedFormats
                  ? props.acceptedFormats
                  : "image/*",
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
          <span
            className={`absolute ${
              ["text", "email", "number", "file"].includes(type)
                ? "right-2"
                : "right-10"
            } top-1/2 transform -translate-y-1/2 text-red-500`}
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

export default Input;
