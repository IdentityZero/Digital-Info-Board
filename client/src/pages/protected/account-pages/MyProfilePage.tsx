import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";
// import { useBlocker } from "react-router-dom";
import _ from "lodash";

import { FullUserType } from "../../../types/UserTypes";
// import { isObjectEqual } from "../../../utils/utils";
import { useAuth } from "../../../context/AuthProvider";
import { Form } from "../../../components/ui";
// import useBlockNavigation from "../../../hooks/useBlockNavigation";
import {
  retrieveUserInformation,
  updateUserInformationApi,
} from "../../../api/userRequest";
import { DisplayUserProfile } from "../../../features/accounts/";
import {
  UserInformationErrorState,
  type UserInformationErrorT,
} from "../../../features/accounts/helpers";
import { Link } from "react-router-dom";

type MyProfilePageContextProps = {
  userProfileForEdit: FullUserType;
  setUserProfileForEdit: React.Dispatch<
    React.SetStateAction<FullUserType | undefined>
  >;
  updateErrors: UserInformationErrorT;
  setUpdateErrors: React.Dispatch<React.SetStateAction<UserInformationErrorT>>;
  isLoading: boolean;
};

export const MyProfilePageContext = createContext<
  MyProfilePageContextProps | undefined
>(undefined);

const MyProfilePage = () => {
  const { user, userApi } = useAuth();
  const [userProfile, setUserProfile] = useState<FullUserType | undefined>(
    undefined
  );
  const [userProfileForEdit, setUserProfileForEdit] = useState<
    FullUserType | undefined
  >(undefined);
  const [updateErrors, setUpdateErrors] = useState<UserInformationErrorT>(
    UserInformationErrorState
  );

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<any>("");
  const [saveLoading, setSaveLoading] = useState(false);

  // const hasUnsavedChanges = () => {
  //   return !isObjectEqual(userProfile, userProfileForEdit);
  // };

  // useBlockNavigation(hasUnsavedChanges());
  // useBlocker(() => {
  //   if (hasUnsavedChanges()) {
  //     if (
  //       window.confirm("You have unsaved changes. Would you like to leave?")
  //     ) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  //   return false;
  // });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res_data = await retrieveUserInformation(
          userApi,
          user?.id as string
        );

        setUserProfile(res_data);
        setUserProfileForEdit(res_data);
      } catch (error) {
        setFetchError(error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleFormUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedUserInformation = _.cloneDeep(userProfileForEdit);
    if (typeof userProfileForEdit?.profile.image === "string") {
      _.unset(updatedUserInformation, "profile.image");
    }

    try {
      setSaveLoading(true);
      setUpdateErrors(UserInformationErrorState);
      const res_data = await updateUserInformationApi(
        userApi,
        userProfile?.id as string,
        updatedUserInformation
      );
      setUserProfileForEdit(res_data);
      setUserProfile(res_data);
      alert("Profile Successfully updated.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;
        if (!err) {
          alert("Unexpected error occured. Please try again.");
        }
        setUpdateErrors((prev) => ({
          ...prev,
          ...err,
        }));
      } else {
        alert("Unexpected error occured. Please try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mt-2 w-full border border-black p-4 bg-white">
        {fetchLoading && (
          <div className="text-center text-xl">Loading your information...</div>
        )}
        {fetchError && (
          <div className="flex flex-col items-center justify-center text-xl text-red-500">
            <p className="flex flex-row items-center justify-center gap-2">
              <span>
                <FaExclamationTriangle />
              </span>
              There was an error loading your information.
            </p>
            <p>Please try again.</p>
          </div>
        )}
        {userProfile && userProfileForEdit && (
          <>
            <MyProfilePageContext.Provider
              value={{
                userProfileForEdit,
                setUserProfileForEdit,
                updateErrors,
                setUpdateErrors,
                isLoading: saveLoading,
              }}
            >
              <Form onSubmitFunc={handleFormUpdate}>
                <DisplayUserProfile />
                <div className="mt-2 w-full flex justify-end gap-2">
                  <Link
                    to={"change-password"}
                    className={`py-2 px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold ${
                      saveLoading && "cursor-not-allowed"
                    }`}
                  >
                    Change Password
                  </Link>
                  <button
                    className={`py-2 px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold ${
                      saveLoading && "cursor-not-allowed"
                    }`}
                    type="submit"
                  >
                    {saveLoading ? "Saving" : "Update"}
                  </button>
                </div>
              </Form>
            </MyProfilePageContext.Provider>
          </>
        )}
      </div>
    </div>
  );
};

export const useMyProfilePageContext = () => {
  const context = useContext(MyProfilePageContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default MyProfilePage;
