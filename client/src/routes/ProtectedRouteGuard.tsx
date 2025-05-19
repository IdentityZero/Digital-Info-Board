import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type ProtectedRouteGuardProps = {
  children: React.ReactNode;
};

const ProtectedRouteGuard = ({ children }: ProtectedRouteGuardProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    if (location.pathname === "/dashboard/logout")
      return <Navigate to="/login" />;
    return <Navigate to={`/login?next=${location.pathname}`} />;
  }

  return <>{children}</>;
};
export default ProtectedRouteGuard;
