import React, { useEffect, useRef, useState } from "react";
import { FullUserType, Role } from "../../types/UserTypes";
import {
  retrieveUserInformation,
  updateUserInformationApi,
} from "../../api/userRequest";
import { useAuth } from "../../context/AuthProvider";
import LoadingMessage from "../../components/LoadingMessage";
import { formatStringUnderscores } from "../../utils/formatters";
import { get_role_positions } from "../../constants/api";
import _ from "lodash";
import { UserInformationErrorState, UserInformationErrorT } from "./helpers";
import axios from "axios";
import { Errortext } from "../../components/ui";
import FormField from "./components/FormField";
import { Link } from "react-router-dom";
import useLoadingToast from "../../hooks/useLoadingToast";
import { Id } from "react-toastify";

type RetrieveUserProfileProps = {
  id: string;
};

const RetrieveUserProfile = ({ id }: RetrieveUserProfileProps) => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [userData, setUserData] = useState<FullUserType>();
  const [selectedRole, setSelectedRole] = useState<Role["role"] | undefined>(
    undefined
  );
  const [roleOptions, setRoleOptions] = useState<
    Role["position"][] | undefined
  >(undefined);
  const [newProfilePicURL, setNewProfilePicURL] = useState<string | null>(null);
  const [updateErrors, setUpdateErrors] = useState<UserInformationErrorT>(
    UserInformationErrorState
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedRole) return;

    setRoleOptions(get_role_positions(selectedRole));
  }, [selectedRole]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res_data = await retrieveUserInformation(userApi, id);
        setUserData(res_data);
        setSelectedRole(res_data.profile.role);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (isLoading) {
    return <LoadingMessage message="Loading..." />;
  }

  // # TODO: Improve
  if (!userData) {
    return <div>Cannot find data...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputName = e.target.name;
    let inputType = e.target.type;

    if (!inputName.includes("profile")) {
      setUserData({
        ...userData,
        [inputName]:
          inputType !== "checkbox" ? e.target.value : e.target.checked,
      });

      return;
    }

    inputName = inputName.replace("profile.", "");
    setUserData({
      ...userData,
      profile: {
        ...userData.profile,
        [inputName]:
          inputType !== "checkbox" ? e.target.value : e.target.checked,
      },
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectName = e.target.name;

    if (selectName === "profile.role") {
      setSelectedRole(e.target.value as Role["role"]);
      setRoleOptions(get_role_positions(e.target.value as Role["role"]));
      setUserData({
        ...userData,
        profile: {
          ...userData.profile,
          role: e.target.value as Role["role"],
          position: get_role_positions(e.target.value as Role["role"])[0],
        },
      });

      return;
    } else if (selectName === "profile.position") {
      setUserData({
        ...userData,
        profile: {
          ...userData.profile,
          position: e.target.value as Role["position"],
        },
      });
      return;
    } else {
      return;
    }
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
        setUserData({
          ...userData,
          profile: {
            ...userData.profile,
            image: file,
          },
        });
        setNewProfilePicURL(URL.createObjectURL(file));
      }
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUserInformation = _.cloneDeep(userData);
    if (typeof userData?.profile.image === "string") {
      _.unset(updatedUserInformation, "profile.image");
    }

    loading("Saving Updates. Please wait...");

    try {
      setUpdateErrors(UserInformationErrorState);
      setIsSaving(true);
      const res_data = await updateUserInformationApi(
        userApi,
        userData.id,
        updatedUserInformation
      );
      setUserData(res_data);
      update({
        render: "Update Succesful.",
        type: "success",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;
        if (!err) {
          update({
            render: "Update unsuccessful. Please try again.",
            type: "error",
          });
          return;
        }
        setUpdateErrors((prev) => ({
          ...prev,
          ...err,
        }));
        update({
          render: "Please check errors before submitting.",
          type: "warning",
        });
      } else {
        update({
          render: "Update unsuccessful. Please try again.",
          type: "error",
        });
        return;
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="w-full flex flex-col pt-6 lg:flex-row gap-y-8"
      onSubmit={handleSubmit}
    >
      <div className="flex-1 flex flex-col items-center gap-4">
        <img
          src={
            newProfilePicURL
              ? newProfilePicURL
              : (userData.profile.image as string)
          }
          alt="Your Profile"
          className="w-[300px] h-[300px] object-cover rounded-full"
        />
        <Errortext text={updateErrors.profile.image} />
        <input
          type="file"
          accept=".jpg, .png, .jpeg, .jfif"
          name="profile.image"
          id="profile-change-prof-pic"
          className="sr-only"
          onChange={handleNewProfilePicChange}
          disabled={isSaving}
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
          error={updateErrors.username}
          labelText="Username"
          id="username"
          value={userData.username}
          type="text"
          name="username"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Role Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden">
          <label
            className="w-[200px] bg-desaturatedBlueGray py-3 px-2 font-bold"
            htmlFor="role"
          >
            Role
          </label>
          <select
            name="profile.role"
            id="role"
            className="flex-1 bg-gray-200 py-3 pl-2 capitalize"
            onChange={handleSelectChange}
            value={selectedRole}
            disabled={isSaving}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        {/* Position Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden">
          <label
            className="w-[200px] bg-desaturatedBlueGray py-3 px-2 font-bold"
            htmlFor="position"
          >
            Position
          </label>
          <select
            name="profile.position"
            id="position"
            className="flex-1 bg-gray-200 py-3 pl-2 capitalize"
            value={userData.profile.position}
            onChange={handleSelectChange}
            disabled={isSaving}
          >
            {roleOptions?.map((position) => (
              <option key={position} value={position}>
                {formatStringUnderscores(position)}
              </option>
            ))}
          </select>
        </div>

        {/* First Name Field */}
        <FormField
          labelText="First Name"
          id="first-name"
          value={userData.first_name}
          type="text"
          name="first_name"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Last Name Field */}
        <FormField
          labelText="Last Name"
          id="last-name"
          value={userData.last_name}
          type="text"
          name="last_name"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Id Number Field */}
        <FormField
          error={updateErrors.profile.id_number}
          labelText="ID Number"
          id="id-number"
          value={userData.profile.id_number}
          type="text"
          name="profile.id_number"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Birthdate Field */}
        <FormField
          error={updateErrors.profile.birthdate}
          labelText="Birthdate"
          id="birthdate"
          value={userData.profile.birthdate}
          type="date"
          name="profile.birthdate"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Admin Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray">
          <label
            htmlFor="admin"
            className="w-[200px] px-2 font-bold flex flex-row items-center gap-2"
          >
            Is Admin
          </label>
          <div className="flex-1 bg-gray-200 h-full pl-2">
            <input
              type="checkbox"
              checked={userData.profile.is_admin}
              className="h-full"
              id="admin"
              name="profile.is_admin"
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Active Field */}
        <div className="flex flex-row items-center rounded-md overflow-hidden border-2 h-[48px] bg-desaturatedBlueGray">
          <label
            htmlFor="active"
            className="w-[200px] px-2 font-bold flex flex-row items-center gap-2"
          >
            Is Active
          </label>
          <div className="flex-1 bg-gray-200 h-full pl-2">
            <input
              type="checkbox"
              checked={userData.is_active}
              className="h-full"
              id="active"
              name="is_active"
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link
            to="change-password"
            className="py-2 px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold"
          >
            Change Password
          </Link>
          <button
            className={`py-2 px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold ${
              isSaving && "cursor-not-allowed"
            }`}
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Updating" : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
};
export default RetrieveUserProfile;
