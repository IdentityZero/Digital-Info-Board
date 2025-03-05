import React, { useRef } from "react";
import { Id } from "react-toastify";
import { FaTrash, FaPaperPlane } from "react-icons/fa";
import IconWithTooltip from "../../components/IconWithTooltip";
import { useAuth } from "../../context/AuthProvider";
import useLoadingToast from "../../hooks/useLoadingToast";

import { formatStringUnderscores } from "../../utils/formatters";

import { ListUserInvitationType } from "../../types/UserTypes";
import {
  deleteUserInvitationApi,
  resendUserInvitationApi,
} from "../../api/userRequest";

type InvitationListProps = {
  invitations: ListUserInvitationType;
  setInvitations: React.Dispatch<React.SetStateAction<ListUserInvitationType>>;
};

const InvitationList = ({
  invitations,
  setInvitations,
}: InvitationListProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const handleResendEmail = async (id: number) => {
    loading("Resending email...");

    try {
      const res_data = await resendUserInvitationApi(userApi, id);
      console.log(res_data);
      update({
        render: "Email Sent.",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      update({
        render: "Failed to send email",
        type: "error",
      });
    }
  };

  const handleDelete = async (id: number, email: string) => {
    const delConf = window.confirm(
      `Are you sure you want to delete your invitation to ${email}`
    );

    if (!delConf) return;
    loading("Deleting invitation...");

    try {
      await deleteUserInvitationApi(userApi, id);
      update({
        render: "Invitation Deleted.",
        type: "success",
      });
      setInvitations((prev) => {
        const arr = prev.results.filter((res) => res.id !== id);
        return { ...prev, results: arr };
      });
    } catch (error) {
      update({
        render: "Delete unsuccesful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="overflow-x-auto p-2">
      <h2 className="text-xl font-semibold mb-4">Invitations Sent</h2>
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Position</th>
            <th className="p-2 border">Used</th>
            <th className="p-2 border">Email Sent</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {invitations.count === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-2">
                You don't have invitations
              </td>
            </tr>
          ) : (
            invitations.results.map((invitation) => (
              <tr
                key={invitation.id}
                className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-2 border">{invitation.id}</td>
                <td className="p-2 border">{invitation.email}</td>
                <td className="p-2 border capitalize">{invitation.role}</td>
                <td className="p-2 border">
                  {formatStringUnderscores(invitation.position)}
                </td>
                <td className="p-2 border">
                  {invitation.is_used ? "Yes" : "No"}
                </td>
                <td className="p-2 border">
                  {invitation.is_email_sent ? "Yes" : "No"}
                </td>
                <td className="p-2 border flex items-center justify-center gap-4">
                  <button
                    className="w-fit h-fit"
                    onClick={() => handleResendEmail(invitation.id)}
                  >
                    <IconWithTooltip
                      icon={FaPaperPlane}
                      label="Resend Mail"
                      iconClassName="text-xl text-btSecondary hover:text-btSecondary-hover active: active:text-btSecondary-active cursor-pointer"
                      labelClassName="p-1 px-2 rounded-md shadow-md bg-btSecondary text-white text-center"
                    />
                  </button>
                  <button
                    className="w-fit h-fit"
                    onClick={() =>
                      handleDelete(invitation.id, invitation.email)
                    }
                  >
                    <IconWithTooltip
                      icon={FaTrash}
                      label="Delete"
                      iconClassName="text-xl text-btDanger hover:text-btDanger-hover active: active:text-btDanger-active cursor-pointer"
                      labelClassName="p-1 px-2 rounded-md shadow-md bg-btDanger text-white text-center"
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default InvitationList;
