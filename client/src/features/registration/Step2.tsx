import { Input } from "../../components/ui";
import { NewUserErrorsType } from "./helpers";
import { type NewUserObjectType } from "./helpers";
import { selectOptionFormatString } from "../../utils";
import { formatInputDate } from "../../utils/formatters";

type Step2Props = {
  formState: NewUserObjectType;
  picture: string | ArrayBuffer | null;
  setFormState: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: NewUserErrorsType;
  loading: boolean;
};

const Step2 = ({
  errors,
  formState,
  setFormState,
  picture,
  loading,
}: Step2Props) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-10 w-full">
      <fieldset className="flex flex-col gap-2 w-full">
        <Input
          type="text"
          required={true}
          ctrl_type="controlled"
          inputValue={formState.username}
          setInputValue={setFormState}
          label="Username"
          name="username"
          placeholder="Enter a username"
          helpText="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
          error={errors.username}
          disabled={loading}
        />
        <Input
          type="password"
          required={true}
          ctrl_type="controlled"
          inputValue={formState.password}
          setInputValue={setFormState}
          label="Password"
          name="password"
          placeholder="Enter a strong password"
          helpText={[
            "Your password can’t be too similar to your other personal information.",
            "Your password must contain at least 8 characters.",
            "Your password can’t be a commonly used password.",
            "Your password can’t be entirely numeric.",
          ]}
          error={errors.password}
          disabled={loading}
        />
        <Input
          type="password"
          required={true}
          ctrl_type="uncontrolled"
          label="Repeat Password"
          name="repeat_password"
          placeholder="Repeat password"
          helpText="Enter the same password as before, for verification."
          error={errors.repeat_password}
          disabled={loading}
        />
      </fieldset>
      <div className="w-full mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        {picture && (
          <div className="flex items-center justify-center lg:mb-6">
            <img
              src={picture as string}
              alt="Uploaded Preview"
              className="w-[100px] h-[100px] object-cover rounded-full border-2 border-gray-300 shadow-sm"
            />
          </div>
        )}
        <div className="text-center lg:mb-6">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {formState.first_name} {formState.last_name}
          </h2>
          <p className="text-sm text-gray-500 capitalize">
            {formState.profile.role || "No Role Specified"}
          </p>
        </div>
        <div className="lg:space-y-4 ">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Birthdate:</span>
            <span className="text-gray-800">
              {(formState.profile.birthdate &&
                formatInputDate(formState.profile.birthdate)) ||
                "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Position:</span>
            <span className="text-gray-800">
              {selectOptionFormatString(formState.profile.position) || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">ID Number:</span>
            <span className="text-gray-800">
              {formState.profile.id_number || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step2;
