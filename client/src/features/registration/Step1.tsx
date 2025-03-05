import { FaUpload } from "react-icons/fa";

import { Errortext, Input } from "../../components/ui";
import { type NewUserErrorsType, type NewUserObjectType } from "./helpers";
import { formatStringUnderscores } from "../../utils/formatters";

// TODO: Display image on load

type Step1Props = {
  formState: NewUserObjectType;
  picture: string | ArrayBuffer | null;
  setFormState: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: NewUserErrorsType;
  loading: boolean;
};

const Step1 = ({
  errors,
  formState,
  picture,
  loading,
  setFormState,
}: Step1Props) => {
  return (
    <div className="w-full flex flex-col gap-4 lg:flex-row">
      <div className="flex flex-col gap-4 w-full">
        <Input
          labelText="Invitation Code"
          required
          name="invitation_code"
          placeholder="Invitation Code"
          value={formState.invitation_code}
          onChange={setFormState}
          error={errors.invitation_code}
          disabled={loading}
        />
        <Input
          type="text"
          required={true}
          value={formState.first_name}
          onChange={setFormState}
          labelText="First Name"
          name="first_name"
          placeholder="First name (e.g. Maria, Lea)"
          error={errors.first_name}
          disabled={loading}
        />
        <Input
          type="text"
          required={true}
          value={formState.last_name}
          onChange={setFormState}
          labelText="Last name"
          name="last_name"
          placeholder="Last name (e.g. Castillo, Collado)"
          error={errors.last_name}
          disabled={loading}
        />
        <Input
          labelText="Role"
          required
          disabled
          error={errors.profile.role}
          name="profile.role"
          placeholder="Role is automatically filled by the invitation code."
          value={formatStringUnderscores(formState.profile.role)}
        />
        <Input
          labelText="Position"
          required
          disabled
          error={errors.profile.role}
          name="profile.position"
          placeholder="Position is automatically filled by the invitation code."
          value={formatStringUnderscores(formState.profile.position)}
        />

        <Input
          type="text"
          required={true}
          value={formState.profile.id_number}
          onChange={setFormState}
          labelText="ID Number"
          name="profile.id_number"
          placeholder="Student number (xx-xxxxxx)."
          helpText="Must have a pattern of xx-xxxxxx. (e.g. 20-123456)"
          error={errors.profile.id_number}
          disabled={loading}
        />
        <Input
          type="date"
          required={true}
          value={formState.profile.birthdate}
          onChange={setFormState}
          labelText="birthdate"
          name="profile.birthdate"
          error={errors.profile.birthdate}
          disabled={loading}
        />
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <label className="text-left w-full block text-gray-700 text-sm font-bold mb-2 capitalize">
          Profile Picture*
        </label>
        {picture ? (
          <label htmlFor="signup-prof-pic" className="cursor-pointer block">
            <img
              src={picture as string}
              alt="Uploaded Preview"
              className="w-full h-[150px] lg:h-full max-h-[500px] object-cover rounded"
            />
          </label>
        ) : (
          <label
            htmlFor="signup-prof-pic"
            className="cursor-pointer block w-full h-full"
          >
            <div className="bg-gray-500 text-white p-2 rounded text-center lg:hidden">
              Upload Profile Picture
            </div>
            <div className="max-lg:hidden flex flex-col items-center justify-center gap-2 h-full w-full bg-gray-100 rounded-lg border text-gray-800">
              <FaUpload className="text-5xl" />
              <p className="font-semibold">Upload Profile Picture</p>
            </div>
          </label>
        )}
        {picture ? (
          <p className="text-sm text-center text-gray-400">
            Click image to change upload.
          </p>
        ) : (
          ""
        )}
        {picture && errors.profile.image && (
          <Errortext text={errors.profile.image} />
        )}

        <input
          type="file"
          accept=".jpg, .png, .jpeg, .jfif"
          required
          onChange={setFormState}
          name="profile.image"
          disabled={loading}
          id="signup-prof-pic"
          className="sr-only" // screen-reader-only to keep it accessible but hidden
        />
      </div>
    </div>
  );
};
export default Step1;
