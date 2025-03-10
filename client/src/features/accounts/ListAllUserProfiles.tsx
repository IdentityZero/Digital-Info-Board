import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";

import LoadingMessage from "../../components/LoadingMessage";
import useLoadingToast from "../../hooks/useLoadingToast";
import { useAuth } from "../../context/AuthProvider";
import {
  deleteUserApi,
  listAllUsersApi,
  updateUserActiveStatusApi,
} from "../../api/userRequest";
import { type ListUserType, listUserInitState } from "../../types/UserTypes";
import ProfileCard from "./components/ProfileCard";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const ListAllUserProfiles = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_accounts",
    10
  );

  const [usersList, setUsersList] = useState<ListUserType>(listUserInitState);
  const totalPages = Math.max(1, Math.ceil(usersList.count / pageSize));

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchAllUsers = async (ppage: number, ppageSize: number) => {
    try {
      setHasError(false);
      setIsLoading(true);
      const res_data = await listAllUsersApi(userApi, ppage, ppageSize);
      setUsersList(res_data);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllUsers(page, pageSize);
  }, [page, pageSize]);

  if (isLoading) {
    return (
      <LoadingMessage message="Loading List of Accounts. Please wait for a moment..." />
    );
  }

  if (hasError) {
    return <div>Unexpected error occured. Please try again later.</div>;
  }

  if (!hasError && !isLoading && usersList.results.length === 0) {
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
      const updatedUserList = usersList.results.map((user) =>
        user.id === id ? { ...user, is_active: activate } : user
      );

      setUsersList((prev) => ({ ...prev, results: updatedUserList }));

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
      const updatedUserList = usersList.results.filter(
        (user) => user.id !== id
      );
      setUsersList((prev) => ({ ...prev, results: updatedUserList }));
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
      <Pagination
        pageSize={pageSize}
        page={page}
        totalPages={totalPages}
        setPageSize={setPageSize}
        setPage={setPage}
      />
      {usersList.results.map((user) => (
        <ProfileCard
          key={user.id}
          user={user}
          handleActivation={handleActivation}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};
export default ListAllUserProfiles;
