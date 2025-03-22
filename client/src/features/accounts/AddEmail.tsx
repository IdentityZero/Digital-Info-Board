import { useRef, useState } from "react";
import { Id } from "react-toastify";

import Button from "./components/Button";
import FormField from "./components/FormField";

import { useAuth } from "../../context/AuthProvider";
import useLoadingToast from "../../hooks/useLoadingToast";

import { addUserEmailApi, verifyEmailCodeApi } from "../../api/userRequest";
import axios from "axios";

const AddEmail = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { user, userApi } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | string[]>("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | string[]>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  if (!user) {
    return <div className="mt-2 text-center">Cannot find data</div>;
  }

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loading("Sending verification code. Please wait...");

    try {
      setIsLoading(true);
      await addUserEmailApi(userApi, { email: email });
      update({
        render:
          "A verification code has been sent to your email. Please check your inbox and spam folder if you don’t see it within a few minutes.",
        type: "success",
      });
      setIsCodeSent(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;

        if (err) {
          setEmailError([...err.email]);
          update({
            render: "Sending code failed. Please try again...",
            type: "warning",
          });
          return;
        }
      }

      update({
        render: "Sending code failed. Please try again..",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loading("Connecting account to email. Please wait...");

    try {
      setIsLoading(true);
      await verifyEmailCodeApi(userApi, email, code);
      update({
        render: "Succesfully connected your email account.",
        type: "success",
      });
      setEmail("");
      setCode("");
      setEmailError("");
      setIsCodeSent(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;

        if (err) {
          setCodeError([...err.code]);
          update({
            render: "Failed to save. Please try again.",
            type: "warning",
          });
          return;
        }
      }
      update({
        render: "Failed to save. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Email</h2>
      <form
        className="flex flex-col gap-3"
        onSubmit={isCodeSent ? handleVerifyCode : handleSendCode}
      >
        <FormField
          error={emailError}
          labelText="Email"
          value={email}
          onChange={(e) => !isCodeSent && setEmail(e.currentTarget.value)}
          type="email"
          required
          disabled={isLoading || isCodeSent}
          placeholder="Email"
        />
        {isCodeSent && (
          <FormField
            error={codeError}
            labelText="Code"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            type="text"
            required
            disabled={isLoading}
            placeholder="Verification Code"
            maxLength={6}
          />
        )}
        <Button
          text={isCodeSent ? "Add email" : "Send code"}
          type="submit"
          disabled={isLoading}
        />
      </form>
    </div>
  );
};
export default AddEmail;
