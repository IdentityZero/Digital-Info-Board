import { useEffect, useRef, useState } from "react";
import { FullUserType } from "../../types/UserTypes";
import {
  deleteUserApi,
  listAllUsersApi,
  updateUserActiveStatusApi,
} from "../../api/userRequest";
import { useAuth } from "../../context/AuthProvider";
import { formatStringUnderscores } from "../../utils/formatters";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import IconWithTooltip from "../../components/IconWithTooltip";
import { Link } from "react-router-dom";
import LoadingMessage from "../../components/LoadingMessage";
import useLoadingToast from "../../hooks/useLoadingToast";
import { Id } from "react-toastify";

const ListAllUserProfiles = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [usersList, setUsersList] = useState<FullUserType[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setHasError(false);
        setIsLoading(true);
        const res_data = await listAllUsersApi(userApi);
        setUsersList(res_data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (isLoading) {
    return (
      <LoadingMessage message="Loading List of Accounts. Please wait for a moment..." />
    );
  }

  if (hasError) {
    return <div>Unexpected error occured. Please try again later.</div>;
  }

  if (!hasError && !isLoading && usersList.length === 0) {
    return <div>You are the only user.</div>;
  }

  const handleActivation = async (id: string, activate: boolean) => {
    const confirmDeac = window.confirm(
      `Are you sure you want to ${
        activate ? "ACTIVATE" : "DEACTIVATE"
      } this user?`
    );

    if (!confirmDeac) return;
    loading(
      activate
        ? "Activating user account. Please wait..."
        : "Deactivating user account. Please wait..."
    );

    const activateData = {
      is_active: activate,
    };

    try {
      await updateUserActiveStatusApi(userApi, id, activateData);
      const updatedUserList = usersList.map((user) =>
        user.id === id ? { ...user, is_active: activate } : user
      );

      setUsersList(updatedUserList);
      alert(`Account ${activate ? "Activated" : "Deactivated"}.`);
      update({
        render: activate
          ? "Account Activated Succesfully."
          : "Account Deactivated Succesfully.",
        type: "success",
      });
    } catch (error) {
      update({
        render: "Update unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? \nDeleting user will also mean deleting contents the user has created. \nWe recommend deactivating account instead."
    );

    if (!confirmDelete) return;
    loading("Deleting User Account. Please wait...");

    try {
      await deleteUserApi(userApi, id);
      const updatedUserList = usersList.filter((user) => user.id !== id);
      setUsersList(updatedUserList);
      update({
        render: "Account Deleted Succesfully.",
        type: "success",
      });
    } catch (error) {
      update({
        render: "Could not delete Account. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {usersList.map((user) => (
        <div
          key={user.id}
          className="w-full flex flex-col border border-black p-2"
        >
          <p className="text-lg font-semibold capitalize w-full bg-cyanBlue p-4 rounded-full flex items-center gap-2">
            {user.profile.is_admin && (
              <IconWithTooltip
                icon={FaCheckCircle}
                label="This user is an admin."
                labelClassName="bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-md whitespace-nowrap z-50"
              />
            )}
            {user.first_name + " " + user.last_name}{" "}
          </p>
          <div className="w-full flex flex-row p-4 gap-4">
            <div className="w-1/5">
              <img
                src={user.profile.image as string}
                alt={`${user.username}'s Profile`}
                className="w-[150px] h-[150px] rounded-full border m-auto"
              />
            </div>

            <div className="p-6 w-2/5">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Username:</span>
                <span className="text-black font-bold capitalize">
                  {user.username}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">ID Number:</span>
                <span className="text-black font-bold capitalize">
                  {user.profile.id_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Role:</span>
                <span className="text-black font-bold capitalize">
                  {user.profile.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Position:</span>
                <span className="text-black font-bold capitalize">
                  {formatStringUnderscores(user.profile.position)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Account Activated:
                </span>
                <span className="text-black font-bold capitalize">
                  {user.is_active ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Admin:</span>
                <span className="text-black font-bold capitalize">
                  {user.profile.is_admin ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 w-full flex justify-end gap-2">
            <Link
              to={`${user.id}`}
              className="py-2 px-16 max-sm:px-6 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold "
              type="button"
            >
              View
            </Link>
            <button
              className="py-2 px-16 max-sm:px-6 rounded-full  bg-btSecondary hover:bg-btSecondary-hover active:bg-btSecondary-active font-semibold "
              type="button"
              onClick={() => handleActivation(user.id, !user.is_active)}
            >
              {user.is_active ? "Deactivate" : "Activate"}
            </button>
            <button
              className="py-2 px-16 max-sm:px-6 rounded-full bg-btDanger hover:bg-btDanger-hover active:bg-btDanger-active font-semibold "
              type="button"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ListAllUserProfiles;
