import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type ProtectedRouteGuardProps = {
  children: React.ReactNode;
};

const ProtectedRouteGuard = ({ children }: ProtectedRouteGuardProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
export default ProtectedRouteGuard;
