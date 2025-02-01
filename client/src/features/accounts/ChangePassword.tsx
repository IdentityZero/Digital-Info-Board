import { useState } from "react";
import axios from "axios";

import { updateUserPasswordApi } from "../../api/userRequest";
import { useAuth } from "../../context/AuthProvider";
import { ChangePasswordErrorState } from "./helpers";
import FormField from "./components/FormField";

const ChangePassword = ({ userID }: { userID: string }) => {
  const { userApi } = useAuth();

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

    try {
      setIsSaving(true);
      setUpdateErrors(ChangePasswordErrorState);
      await updateUserPasswordApi(userApi, userID, data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password Updated");
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
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField
          error={updateErrors.old_password}
          labelText="Current Password"
          id="current-password"
          value={currentPassword}
          type="password"
          name="old_password"
          onChange={(e) => setCurrentPassword(e.target.value)}
          isRequired
          isDisabled={isSaving}
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
          isRequired
          isDisabled={isSaving}
          placeholder="New Password"
        />
        <FormField
          error={updateErrors.password2}
          labelText="Confirm New Password"
          id="confirm-new-password"
          value={confirmPassword}
          type="password"
          name="password2"
          onChange={(e) => setConfirmPassword(e.target.value)}
          isRequired
          isDisabled={isSaving}
          placeholder="Confirm New Password"
        />

        <button
          type="submit"
          className={`py-2 px-8 rounded-full bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker font-semibold ${
            isSaving && "cursor-not-allowed"
          }`}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};
export default ChangePassword;
