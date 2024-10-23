import { Input } from "../../components/ui";
import { NewUserErrorsType } from "./helpers";
import { type NewUserObjectType } from "./helpers";
import { selectOptionFormatString } from "../../utils";

type Step2Props = {
  hidden: boolean;
  formState: NewUserObjectType;
  picture: string | ArrayBuffer | null;
  setFormState: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: NewUserErrorsType;
  loading: boolean;
};

const Step2 = ({
  hidden,
  errors,
  formState,
  setFormState,
  picture,
  loading,
}: Step2Props) => {
  return (
    <div className={`flex flex-row gap-10 ${hidden && "hidden"}`}>
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
      <div className="w-full">
        {picture && (
          <img
            src={picture as string}
            alt="Uploaded Preview"
            className="w-[120px] h-[120px] object-cover rounded-full border-black border-[1px]"
          />
        )}
        <p>First Name: {formState.first_name}</p>
        <p>Last Name: {formState.last_name}</p>
        <p>Birthdate: {formState.profile.birthdate}</p>
        <p>Role: {selectOptionFormatString(formState.profile.role)}</p>
        <p>Position: {selectOptionFormatString(formState.profile.position)}</p>
        <p>ID Number: {formState.profile.id_number}</p>
      </div>
    </div>
  );
};
export default Step2;
