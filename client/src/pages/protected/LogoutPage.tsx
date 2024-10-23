import { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";

const LogoutPage = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);

  return <div>LOGOUT PAGE! DO THIS BETTER JUST IN CASE OF I DONT KNOW</div>;
};
export default LogoutPage;
