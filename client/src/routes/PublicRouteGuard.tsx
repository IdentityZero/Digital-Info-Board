import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type PublicRouteGuardProps = {
  children: React.ReactNode;
};

const PublicRouteGuard = ({ children }: PublicRouteGuardProps) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
export default PublicRouteGuard;
