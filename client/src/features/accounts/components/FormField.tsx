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
  helpText,
  ...inputProps
}: FormFieldProps) {
  /**
   * Label text is automatically set as the ID of input
   */
  const { type: inputType } = inputProps;

  return (
    <>
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center rounded-md overflow-hidden border-2 h-auto sm:h-[48px] bg-desaturatedBlueGray ${
          error ? "border-red-500" : "border-transparent"
        }`}
      >
        <label
          className="px-2 py-2 sm:py-0 font-bold text-sm sm:text-base flex flex-row items-center gap-2 w-full sm:w-[150px] lg:w-[180px]"
          htmlFor={labelText}
        >
          {error && (
            <FaExclamationCircle className="text-red-500 bg-white rounded-full text-sm sm:text-base" />
          )}
          {labelText}
        </label>

        {/* Input or Checkbox */}
        {inputType === "checkbox" ? (
          <div className="w-full flex-1 bg-gray-200 h-full pl-2">
            <input
              id={labelText}
              type="checkbox"
              className="h-full disabled:cursor-not-allowed"
              {...inputProps}
            />
          </div>
        ) : (
          <input
            id={labelText}
            type="text"
            className="w-full flex-1 bg-gray-200 py-2 sm:py-3 px-2 text-sm sm:text-base disabled:cursor-not-allowed"
            {...inputProps}
          />
        )}
      </div>

      {error && <Errortext text={error} />}
      {helpText && <Helptext text={helpText} />}
    </>
  );
}

export default FormField;
