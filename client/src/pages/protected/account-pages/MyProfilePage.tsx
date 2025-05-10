import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Id } from "react-toastify";
// import { useBlocker } from "react-router-dom";
import _ from "lodash";

import ErrorMessage from "../../../components/ErrorMessage";
import { Form } from "../../../components/ui";

// import useBlockNavigation from "../../../hooks/useBlockNavigation";
import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

// import { isObjectEqual } from "../../../utils/utils";
import {
  UserInformationErrorState,
  type UserInformationErrorT,
} from "../../../features/accounts/helpers";

import { FullUserType } from "../../../types/UserTypes";
import {
  retrieveUserInformation,
  updateUserInformationApi,
} from "../../../api/userRequest";
import { DisplayUserProfile } from "../../../features/accounts/";
import Button from "../../../components/ui/ButtonV2";

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
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
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

    loading("Saving Updates. Please wait...");

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
      update({
        render: "Update Successful.",
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
          <ErrorMessage message="Something went wrong while fetching your Profile Information. Please try again." />
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
                <div className="mt-2 w-full flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-4">
                  <Link
                    to="/dashboard/account/my-profile/change-password"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      text="Change Password"
                      disabled={saveLoading}
                      type="button"
                    />
                  </Link>
                  <Link
                    to="/dashboard/account/my-profile/update-email"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      text={
                        userProfileForEdit.email === ""
                          ? "Add Email"
                          : "Update Email"
                      }
                      type="button"
                      disabled={saveLoading}
                    />
                  </Link>
                  <div className="w-full sm:w-auto">
                    <Button
                      type="submit"
                      text={saveLoading ? "Saving" : "Update"}
                      disabled={saveLoading}
                    />
                  </div>
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
