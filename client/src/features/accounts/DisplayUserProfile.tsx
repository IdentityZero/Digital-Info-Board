import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { Errortext } from "../../components/ui";

import FormField from "./components/FormField";
import SelectField from "./components/SelectField";

import { useAuth } from "../../context/AuthProvider";
import { Role } from "../../types/UserTypes";
import { get_role_positions } from "../../constants";
import {
  capitalizeWords,
  formatStringUnderscores,
} from "../../utils/formatters";

import { useMyProfilePageContext } from "../../pages/protected/account-pages/MyProfilePage";
import { MAX_IMAGE_SIZE } from "../../constants/api";

const DisplayUserProfile = ({}) => {
  const { user } = useAuth();

  const {
    userProfileForEdit,
    setUserProfileForEdit,
    isLoading,
    updateErrors: errors,
  } = useMyProfilePageContext();
  const [roleOptions, setRoleOptions] = useState<
    Role["position"][] | undefined
  >(undefined);

  useEffect(() => {
    if (!userProfileForEdit.profile.role) return;

    setRoleOptions((_prev) => {
      const options = get_role_positions(userProfileForEdit.profile.role);
      setUserProfileForEdit({
        ...userProfileForEdit,
        profile: { ...userProfileForEdit.profile, position: options[0] },
      });

      return options;
    });
  }, [userProfileForEdit.profile.role]);

  const [newProfilePicURL, setNewProfilePicURL] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let inputName = e.target.name;
    if (!inputName.includes("profile")) {
      setUserProfileForEdit({
        ...userProfileForEdit,
        [inputName]: e.target.value,
      });
      return;
    }

    inputName = inputName.replace("profile.", "");

    setUserProfileForEdit({
      ...userProfileForEdit,
      profile: { ...userProfileForEdit.profile, [inputName]: e.target.value },
    });
  };

  const handleNewProfilePicChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.type === "file" &&
      e.target.files &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];

      if (file.size > MAX_IMAGE_SIZE) {
        toast.warning("File size exceeds 10MB. Upload aborted.");
        e.target.value = "";
        return;
      }

      if (file) {
        setUserProfileForEdit({
          ...userProfileForEdit,
          profile: {
            ...userProfileForEdit.profile,
            image: file,
          },
        });
        setNewProfilePicURL(URL.createObjectURL(file));
      }
      return;
    }
  };

  return (
    <div className="w-full flex flex-col pt-6 lg:flex-row gap-y-8">
      <div className="flex-1 flex flex-col items-center gap-4">
        <img
          src={
            newProfilePicURL
              ? newProfilePicURL
              : (userProfileForEdit.profile.image as string)
          }
          alt="Your Profile"
          className={`w-[250px] h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] aspect-square object-cover rounded-full ${
            errors.profile.image && "border-4 border-red-500"
          }`}
        />
        <Errortext text={errors.profile.image} />
        <input
          type="file"
          accept=".jpg, .png, .jpeg, .jfif"
          name="profile.image"
          id="profile-change-prof-pic"
          className="sr-only"
          onChange={handleNewProfilePicChange}
          disabled={isLoading}
        />
        <label
          htmlFor="profile-change-prof-pic"
          className="py-2 px-4 sm:px-6 md:px-8 text-sm sm:text-base rounded-full font-semibold text-black
                  bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker
                  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer"
        >
          Change Profile
        </label>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {/* Username Field */}
        <FormField
          error={errors.username}
          labelText="Username"
          value={userProfileForEdit.username}
          name="username"
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        {/* Role Field */}
        {user?.is_admin ? (
          <SelectField
            labelText="Role"
            name="profile.role"
            onChange={handleInputChange}
            required
            value={userProfileForEdit.profile.role}
            disabled={isLoading}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </SelectField>
        ) : (
          <FormField
            labelText="Role"
            value={capitalizeWords(userProfileForEdit.profile.role)}
            required
            disabled
          />
        )}

        {/* Position Field */}

        {user?.is_admin ? (
          <SelectField
            labelText="Position"
            name="profile.position"
            onChange={handleInputChange}
            required
            value={userProfileForEdit.profile.position}
            disabled={isLoading}
          >
            {roleOptions?.map((position) => (
              <option key={position} value={position}>
                {formatStringUnderscores(position)}
              </option>
            ))}
          </SelectField>
        ) : (
          <FormField
            labelText="Role"
            value={formatStringUnderscores(userProfileForEdit.profile.position)}
            required
            disabled
          />
        )}

        {/* First Name Field */}
        <FormField
          error={errors.first_name}
          labelText="First Name"
          value={userProfileForEdit.first_name}
          name="first_name"
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        {/* Last Name Field */}
        <FormField
          error={errors.last_name}
          labelText="Last Name"
          value={userProfileForEdit.last_name}
          name="last_name"
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        {/* Email */}
        <FormField
          type="email"
          error={errors.email}
          labelText="Email"
          value={userProfileForEdit.email}
          onChange={handleInputChange}
          required
          disabled
        />

        {/* Id Number Field */}
        <FormField
          error={errors.profile.id_number}
          labelText="ID Number"
          value={userProfileForEdit.profile.id_number}
          name="profile.id_number"
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />

        {/* Birthdate Field */}
        <FormField
          type="date"
          error={errors.profile.birthdate}
          labelText="Birthdate"
          value={userProfileForEdit.profile.birthdate}
          name="profile.birthdate"
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
export default DisplayUserProfile;
