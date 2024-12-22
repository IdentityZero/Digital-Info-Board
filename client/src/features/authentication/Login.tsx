import { Input, Form } from "../../components/ui";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const { login, error: authError } = useAuth();

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
          <div>
            <Input
              label="Username"
              ctrl_type="uncontrolled"
              name="username"
              placeholder="Enter Username"
              required={true}
            />
          </div>
          <div>
            <Input
              label="Password"
              ctrl_type="uncontrolled"
              type="password"
              name="password"
              placeholder="Enter password"
              required={true}
            />
            <a
              href="#"
              className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline flex justify-end"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
          >
            Login
          </button>
        </div>
      </Form>
    </div>
  );
};
export default Login;
