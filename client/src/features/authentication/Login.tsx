import { Link } from "react-router-dom";
import { Input, Form } from "../../components/ui";
import { useAuth } from "../../context/AuthProvider";
import LoadingMessage from "../../components/LoadingMessage";

const Login = () => {
  const { login, error: authError, isLoggingIn } = useAuth();

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    login(data.username as string, data.password as string);
  };

  return (
    <div className="w-full">
      <Form error={authError} onSubmitFunc={handleForm}>
        <div className="flex flex-col gap-4">
          {isLoggingIn && (
            <LoadingMessage
              message="Verifying account. Please wait..."
              spinnerSize={24}
              fontSize="base"
            />
          )}
          <div>
            <Input
              labelText="Username"
              name="username"
              placeholder="Enter Username"
              required={true}
              disabled={isLoggingIn}
            />
          </div>
          <div>
            <Input
              labelText="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              required={true}
              disabled={isLoggingIn}
            />
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline flex justify-end"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-2 w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:shadow-none transition"
          >
            Login
          </button>
        </div>
      </Form>
    </div>
  );
};
export default Login;
