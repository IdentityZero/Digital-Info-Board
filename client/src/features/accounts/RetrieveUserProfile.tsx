import React, { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";
import axios from "axios";
import _ from "lodash";

import { Errortext } from "../../components/ui";
import FormField from "./components/FormField";
import Button from "./components/Button";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import SelectField from "./components/SelectField";

import { formatStringUnderscores } from "../../utils/formatters";
import { get_role_positions } from "../../constants/api";

import useLoadingToast from "../../hooks/useLoadingToast";
import { useAuth } from "../../context/AuthProvider";

import { FullUserType, Role } from "../../types/UserTypes";
import {
  retrieveUserInformation,
  updateUserInformationApi,
} from "../../api/userRequest";
import { UserInformationErrorState, UserInformationErrorT } from "./helpers";

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

  if (!userData) {
    return (
      <ErrorMessage message="Something went wrong while fetching your User Information. Please try again." />
    );
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
          className={`w-[250px] h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] aspect-square object-cover rounded-full ${
            updateErrors.profile.image && "border-4 border-red-500"
          }`}
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
        <label htmlFor="profile-change-prof-pic">
          <Button text="Change Profile" />
        </label>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {/* Username Field */}
        <FormField
          error={updateErrors.username}
          labelText="Username"
          value={userData.username}
          type="text"
          name="username"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Role Field */}
        <SelectField
          labelText="Role"
          name="profile.role"
          onChange={handleSelectChange}
          required
          value={selectedRole}
          disabled={isSaving}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </SelectField>

        {/* Position Field */}
        <SelectField
          labelText="Position"
          name="profile.position"
          onChange={handleSelectChange}
          required
          value={userData.profile.position}
          disabled={isLoading}
        >
          {roleOptions?.map((position) => (
            <option key={position} value={position}>
              {formatStringUnderscores(position)}
            </option>
          ))}
        </SelectField>

        {/* First Name Field */}
        <FormField
          labelText="First Name"
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
          value={userData.last_name}
          type="text"
          name="last_name"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        <FormField
          labelText="Email"
          value={userData.email}
          type="email"
          name="email"
          disabled
        />

        {/* Id Number Field */}
        <FormField
          error={updateErrors.profile.id_number}
          labelText="ID Number"
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
          value={userData.profile.birthdate}
          type="date"
          name="profile.birthdate"
          onChange={handleInputChange}
          disabled={isSaving}
          required
        />

        {/* Admin Field */}
        <FormField
          labelText="Is Admin"
          type="checkbox"
          checked={userData.profile.is_admin}
          name="profile.is_admin"
          onChange={handleInputChange}
          disabled={isSaving}
        />

        {/* Active Field */}
        <FormField
          labelText="Is Active"
          type="checkbox"
          checked={userData.is_active}
          name="is_active"
          onChange={handleInputChange}
          disabled={isSaving}
        />

        <div className="flex justify-end gap-2">
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
