import { useEffect, useRef, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

import { useAuth } from "../../../context/AuthProvider";
import { FullUserType } from "../../../types/UserTypes";
import {
  listInactiveUsersApi,
  updateUserActiveStatusApi,
} from "../../../api/userRequest";
import { ListUserProfilesRequest } from "../../../features/accounts";
import useLoadingToast from "../../../hooks/useLoadingToast";
import { Id } from "react-toastify";

const ProfileRequestPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [usersList, setUsersList] = useState<FullUserType[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<any>("");

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const res_data = await listInactiveUsersApi(userApi);
        setUsersList(res_data);
      } catch (error) {
        setFetchError(error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUsersList();
  }, []);

  const handleApproveButton = async (id: string) => {
    const confirm_approve = window.confirm(
      "Are you sure you want to activate this user?"
    );

    if (!confirm_approve) return;

    const activate_acc_data = {
      is_active: true,
    };

    loading("Activating user account. Please wait...");

    try {
      await updateUserActiveStatusApi(userApi, id, activate_acc_data);
      const udpatedUserList = usersList.filter((user) => user.id !== id);
      setUsersList(udpatedUserList);
      update({ render: "Account Activated", type: "success" });
    } catch (error) {
      update({
        render: "Activation Unsuccesful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="p-4">
      <div className="mt-2 w-full border border-black p-4 bg-white">
        {fetchLoading && (
          <div className="text-center text-xl">Loading information...</div>
        )}
        {fetchError && (
          <div className="flex flex-col items-center justify-center text-xl text-red-500">
            <p className="flex flex-row items-center justify-center gap-2">
              <span>
                <FaExclamationTriangle />
              </span>
              There was an fetching information.
            </p>
            <p>Please try again.</p>
          </div>
        )}
        {!fetchLoading && usersList.length === 0 && (
          <div>There are no profile requests</div>
        )}
        {usersList && (
          <ListUserProfilesRequest
            usersList={usersList}
            approveFunc={handleApproveButton}
          />
        )}
      </div>
    </div>
  );
};
export default ProfileRequestPage;
