import { useState } from "react";

import { Input, Select } from "../../components/ui";
import { type Role } from "../../types/UserTypes";
import { get_role_positions } from "../../constants";
import { type NewUserErrorsType, type NewUserObjectType } from "./helpers";

// TODO: Display image on load

type Step1Props = {
  hidden: boolean;
  formState: NewUserObjectType;
  picture: string | ArrayBuffer | null;
  setFormState: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: NewUserErrorsType;
  loading: boolean;
};

const Step1 = ({
  hidden,
  errors,
  formState,
  picture,
  loading,
  setFormState,
}: Step1Props) => {
  const [selectedRole, setSelectedRole] = useState<Role["role"]>("student");
  const [roleOptions, setRoleOptions] = useState<string[]>(
    get_role_positions(selectedRole)
  );

  const handleOnRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value as Role["role"]);
    setRoleOptions(get_role_positions(e.target.value as Role["role"]));
  };

  return (
    <div className={`flex flex-col gap-2 w-[40%] ${hidden && "hidden"}`}>
      <h1>Step 1</h1>
      <Input
        type="text"
        required={true}
        ctrl_type="controlled"
        inputValue={formState.first_name}
        setInputValue={setFormState}
        label="First Name"
        name="first_name"
        placeholder="First name (e.g. Maria, Lea)"
        error={errors.first_name}
        disabled={loading}
      />
      <Input
        type="text"
        required={true}
        ctrl_type="controlled"
        inputValue={formState.last_name}
        setInputValue={setFormState}
        label="Last name"
        name="last_name"
        placeholder="Last name (e.g. Castillo, Collado)"
        error={errors.last_name}
        disabled={loading}
      />
      <Select
        required={true}
        options={["student", "faculty"]}
        defaultValue={selectedRole}
        label="Role"
        name="profile.role"
        onChangeFunc={handleOnRoleChange}
        error={errors.profile.role}
      />
      <Select
        required={true}
        options={roleOptions}
        label="Position"
        name="profile.position"
        error={errors.profile.position}
      />
      <Input
        type="text"
        required={true}
        ctrl_type="controlled"
        inputValue={formState.profile.id_number}
        setInputValue={setFormState}
        label="ID Number"
        name="profile.id_number"
        placeholder="Student number (xx-xxxxxx)."
        helpText="Must have a pattern of xx-xxxxxx. (e.g. 20-123456)"
        error={errors.profile.id_number}
        disabled={loading}
      />
      <Input
        type="date"
        required={true}
        ctrl_type="controlled"
        inputValue={formState.profile.birthdate}
        setInputValue={setFormState}
        label="birthdate"
        name="profile.birthdate"
        error={errors.profile.birthdate}
        disabled={loading}
      />
      <Input
        type="file"
        required={true}
        ctrl_type="file-controlled"
        setInputValue={setFormState}
        label="Image"
        name="profile.image"
        disabled={loading}
      />
      {picture && (
        <img
          src={picture as string}
          alt="Uploaded Preview"
          className="h-[150px] object-cover"
        />
      )}
    </div>
  );
};
export default Step1;
