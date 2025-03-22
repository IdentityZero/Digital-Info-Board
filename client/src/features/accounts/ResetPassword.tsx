import { useState } from "react";
import { Button, Input } from "../../components/ui";
import LoadingMessage from "../../components/LoadingMessage";
import axios from "axios";
import { resetPasswordConfirmApi } from "../../api/userRequest";
import { Link } from "react-router-dom";

type ResetPasswordProps = {
  id: string;
  token: string;
};

const ResetPassword = ({ id, token }: ResetPasswordProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [isSuccesful, setIsSuccessful] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      const res_data = await resetPasswordConfirmApi(password, id, token);
      setMessage(res_data.message);
      setIsSuccessful(true);
    } catch (error) {
      setHasError(true);
      if (!axios.isAxiosError(error)) {
        setMessage("Unexpected error occured. Please try again.");
        return;
      }
      const err = error.response?.data;

      if (!err) {
        setMessage("Unexpected error occured. Please try again.");
        return;
      }

      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccesful) {
    return (
      <div className="text-center">
        <p className="text-green-600 text-sm mb-4">
          Your password has been successfully reset.
        </p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 shadow-lg bg-white rounded-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>
        {isLoading && <LoadingMessage message="Processing..." />}
        {!isLoading && message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <Input
            error={hasError ? message : ""}
            name="password"
            labelText="New Password"
            placeholder="Enter new password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            error={hasError ? message : ""}
            name="confirm-password"
            labelText="Confirm Password"
            placeholder="Confirm new password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit">Reset Password</Button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
