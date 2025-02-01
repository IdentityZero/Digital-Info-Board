import { FaExclamationCircle } from "react-icons/fa";
import { Errortext } from "../../../components/ui";

type FormFieldProps = {
  error?: string | string[];
  labelText: string;

  // Input Props
  id: string; // label prop
  type: string;
  value: any;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  isRequired: boolean;
  placeholder?: string;
};

function FormField({
  error = "",
  labelText,
  id,
  value,
  type,
  name,
  onChange,
  isDisabled,
  isRequired,
  placeholder,
}: FormFieldProps) {
  /**
   * Customized for Accounts Form Field
   * ex.
   * <FormField
        error={updateErrors.username}
        labelText="Username"
        id="username"
        value={userData.username}
        type="text"
        name="username"
        onChange={handleInputChange}
        isDisabled={isSaving}
        isRequired
    />
   */
  return (
    <>
      <div
        className={`flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray ${
          error && "border-2 border-red-500"
        }`}
      >
        <label
          className="w-[200px] px-2 font-bold flex flex-row items-center gap-2"
          htmlFor={id}
        >
          {error && (
            <FaExclamationCircle className="text-red-500 bg-white rounded-full" />
          )}
          {labelText}
        </label>
        <input
          type={type}
          value={value}
          name={name}
          id={id}
          className="flex-1 bg-gray-200 py-3 pl-2"
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          placeholder={placeholder}
        />
      </div>
      {error && <Errortext text={error} />}
    </>
  );
}
export default FormField;
