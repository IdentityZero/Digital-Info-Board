import { Input, Button, Form } from "../../components/ui";
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
    <div>
      <h1>Login</h1>
      <div className="w-[700px] p-5">
        <Form error={authError} onSubmitFunc={handleForm}>
          <Input
            label="Username"
            ctrl_type="uncontrolled"
            name="username"
            placeholder="Enter Username"
            required={true}
          />
          <Input
            label="Password"
            ctrl_type="uncontrolled"
            type="password"
            name="password"
            placeholder="Enter password"
            required={true}
          />
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </div>
  );
};
export default Login;
