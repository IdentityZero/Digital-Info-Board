import { useState } from "react";
import { Errortext } from "../../components/ui";
import { FaExclamationCircle } from "react-icons/fa";

import { useMyProfilePageContext } from "../../pages/protected/account-pages/MyProfilePage";

const DisplayUserProfile = ({}) => {
  const {
    userProfileForEdit,
    setUserProfileForEdit,
    isLoading,
    updateErrors: errors,
  } = useMyProfilePageContext();

  const [newProfilePicURL, setNewProfilePicURL] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="flex flex-row items-center rounded-md overflow-hidden">
          <label className="w-[150px] xl:w-[180px] bg-desaturatedBlueGray py-3 px-2 font-bold">
            Username
          </label>
          <input
            type="text"
            value={userProfileForEdit.username}
            className="flex-1 bg-gray-200 py-3 pl-2 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Role Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden">
          <label className="w-[150px] xl:w-[180px] bg-desaturatedBlueGray py-3 px-2 font-bold">
            Role
          </label>
          <input
            type="text"
            value={userProfileForEdit.profile.role}
            className="flex-1 bg-gray-200 py-3 pl-2 cursor-not-allowed capitalize"
            disabled
          />
        </div>

        {/* Position Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden mb-4">
          <label className="w-[150px] xl:w-[180px] bg-desaturatedBlueGray py-3 px-2 font-bold">
            Position
          </label>
          <input
            type="text"
            value={userProfileForEdit.profile.position}
            className="flex-1 bg-gray-200 py-3 pl-2 cursor-not-allowed capitalize"
            disabled
          />
        </div>

        {/* First Name Field */}
        <div>
          <div
            className={`flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray ${
              errors.first_name && "border-2 border-red-500"
            }`}
          >
            <label
              htmlFor="first-name"
              className="w-[150px] xl:w-[180px] px-2 font-bold flex flex-row items-center gap-2"
            >
              {errors.first_name && (
                <FaExclamationCircle className="text-red-500" />
              )}
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              name="first_name"
              value={userProfileForEdit.first_name}
              className="flex-1 bg-gray-200 h-full pl-2"
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <Errortext text={errors.first_name} />
        </div>

        {/* Last Name Field */}
        <div>
          <div
            className={`flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray ${
              errors.last_name && "border-2 border-red-500"
            }`}
          >
            <label
              htmlFor="last-name"
              className="w-[150px] xl:w-[180px] px-2 font-bold flex flex-row items-center gap-2"
            >
              {errors.last_name && (
                <FaExclamationCircle className="text-red-500" />
              )}
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              name="last_name"
              value={userProfileForEdit.last_name}
              className="flex-1 bg-gray-200 h-full pl-2"
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <Errortext text={errors.last_name} />
        </div>

        {/* Id Number Field */}
        <div>
          <div
            className={`flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray ${
              errors.profile.id_number && "border-2 border-red-500"
            }`}
          >
            <label
              htmlFor="id-number"
              className="w-[150px] xl:w-[180px] px-2 font-bold flex flex-row items-center gap-2"
            >
              {errors.profile.id_number && (
                <FaExclamationCircle className="text-red-500" />
              )}
              ID Number
            </label>
            <input
              type="text"
              id="id-number"
              name="profile.id_number"
              value={userProfileForEdit.profile.id_number}
              className="flex-1 bg-gray-200 h-full pl-2"
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <Errortext text={errors.profile.id_number} />
        </div>

        {/* Birthdate Field */}
        <div>
          <div
            className={`flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray ${
              errors.profile.birthdate && "border-2 border-red-500"
            }`}
          >
            <label
              htmlFor="birthdate"
              className="w-[150px] xl:w-[180px] px-2 font-bold flex flex-row items-center gap-2"
            >
              {errors.profile.birthdate && (
                <FaExclamationCircle className="text-red-500" />
              )}
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="profile.birthdate"
              value={userProfileForEdit.profile.birthdate}
              className="flex-1 bg-gray-200 h-full pl-2"
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          <Errortext text={errors.profile.birthdate} />
        </div>
      </div>
    </div>
  );
};
export default DisplayUserProfile;
