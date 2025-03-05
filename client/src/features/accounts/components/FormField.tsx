import { FaExclamationCircle } from "react-icons/fa";
import { Errortext, Helptext } from "../../../components/ui";

type FormFieldProps = {
  error?: string | string[];
  labelText: string;
  labelWidth?: string; // in Pixels
  helpText?: string | string[];
} & React.InputHTMLAttributes<HTMLInputElement>;

function FormField({
  error = "",
  labelText,
  labelWidth = "200px",
  helpText,
  ...inputProps
}: FormFieldProps) {
  /**
   * Label text is automatically set as the ID of input
   */
  return (
    <>
      <div
        className={`flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray ${
          error && "border-2 border-red-500"
        }`}
      >
        <label
          className="px-2 font-bold flex flex-row items-center gap-2"
          htmlFor={labelText}
          style={{ width: labelWidth }}
        >
          {error && (
            <FaExclamationCircle className="text-red-500 bg-white rounded-full" />
          )}
          {labelText}
        </label>
        <input
          id={labelText}
          className="flex-1 bg-gray-200 py-3 pl-2"
          {...inputProps}
        />
      </div>
      {error && <Errortext text={error} />}
      {helpText && <Helptext text={helpText} />}
    </>
  );
}

export default FormField;
