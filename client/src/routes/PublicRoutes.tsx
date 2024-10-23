import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type PublicRoutesProps = {
  children: React.ReactNode;
};

const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
export default PublicRoutes;
