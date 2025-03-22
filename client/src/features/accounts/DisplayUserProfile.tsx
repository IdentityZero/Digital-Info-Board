import { useEffect, useState } from "react";
import { Errortext } from "../../components/ui";

import { useMyProfilePageContext } from "../../pages/protected/account-pages/MyProfilePage";
import { formatStringUnderscores } from "../../utils/formatters";
import { useAuth } from "../../context/AuthProvider";
import { Role } from "../../types/UserTypes";
import { get_role_positions } from "../../constants";
import FormField from "./components/FormField";

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
          className={`w-[300px] h-[300px] object-cover rounded-full ${
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
          className="py-2 px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold cursor-pointer"
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
        <div className="flex flex-row items-center rounded-md overflow-hidden">
          <label
            htmlFor="role"
            className="w-[200px] bg-desaturatedBlueGray py-3 px-2 font-bold"
          >
            Role
          </label>
          {user?.is_admin ? (
            <select
              name="profile.role"
              id="role"
              className="flex-1 bg-gray-200 py-3 pl-2 capitalize"
              onChange={handleInputChange}
              value={userProfileForEdit.profile.role}
              disabled={isLoading}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          ) : (
            <input
              type="text"
              value={userProfileForEdit.profile.role}
              className="flex-1 bg-gray-200 py-3 pl-2 cursor-not-allowed capitalize"
              disabled
            />
          )}
        </div>

        {/* Position Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden mb-4">
          <label
            htmlFor="position"
            className="w-[200px] bg-desaturatedBlueGray py-3 px-2 font-bold"
          >
            Position
          </label>
          {user?.is_admin ? (
            <select
              name="profile.position"
              id="position"
              className="flex-1 bg-gray-200 py-3 pl-2 capitalize"
              value={userProfileForEdit.profile.position}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              {roleOptions?.map((position) => (
                <option key={position} value={position}>
                  {formatStringUnderscores(position)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formatStringUnderscores(
                userProfileForEdit.profile.position
              )}
              className="flex-1 bg-gray-200 py-3 pl-2 cursor-not-allowed capitalize"
              disabled
            />
          )}
        </div>

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
