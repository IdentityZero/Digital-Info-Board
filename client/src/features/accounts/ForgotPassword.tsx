import { useState } from "react";

import { Button, Input } from "../../components/ui";
import { resetPasswordApi } from "../../api/userRequest";
import axios from "axios";
import LoadingMessage from "../../components/LoadingMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setHasError(false);
      const res_data = await resetPasswordApi(email);
      setMessage(res_data.message);
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

  return (
    <div className="w-full max-w-md p-6 shadow-lg bg-white rounded-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address to receive a password reset link.
        </p>
        {isLoading && <LoadingMessage message="Processing..." />}
        {!isLoading && message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full flex flex-col"
        >
          <div>
            <Input
              error={hasError ? message : ""}
              labelText="Enter your email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;
