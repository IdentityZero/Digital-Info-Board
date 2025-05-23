import { useRef, useState } from "react";
import axios from "axios";

import { updateUserPasswordApi } from "../../api/userRequest";
import { useAuth } from "../../context/AuthProvider";
import { ChangePasswordErrorState } from "./helpers";
import FormField from "./components/FormField";
import { Id } from "react-toastify";
import useLoadingToast from "../../hooks/useLoadingToast";
import Button from "../../components/ui/ButtonV2";

const ChangePassword = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi, user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateErrors, setUpdateErrors] = useState(ChangePasswordErrorState);

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      old_password: currentPassword,
      password: newPassword,
      password2: confirmPassword,
    };

    loading("Updating password. Please wait", { position: "top-center" });

    try {
      setIsSaving(true);
      setUpdateErrors(ChangePasswordErrorState);
      await updateUserPasswordApi(userApi, user?.id as string, data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      update({ render: "Update successful", type: "success" });
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
    <div className="p-4 w-full mx-auto border rounded-lg shadow-md">
      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField
          error={updateErrors.old_password}
          labelText="Current Password"
          id="current-password"
          value={currentPassword}
          type="password"
          name="old_password"
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          disabled={isSaving}
          placeholder="Old/Current Password"
        />
        <FormField
          error={updateErrors.password}
          labelText="New Password"
          id="new-password"
          value={newPassword}
          type="password"
          name="password"
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isSaving}
          placeholder="New Password"
        />
        <FormField
          error={updateErrors.password2}
          labelText="Confirm Password"
          id="confirm-new-password"
          value={confirmPassword}
          type="password"
          name="password2"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isSaving}
          placeholder="Confirm New Password"
        />

        <Button
          text={isSaving ? "Saving..." : "Change Password"}
          type="submit"
          disabled={isSaving}
        />
      </form>
    </div>
  );
};
export default ChangePassword;
