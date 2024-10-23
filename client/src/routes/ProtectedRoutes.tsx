import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type ProtectedRoutesProps = {
  children: React.ReactNode;
};

const ProtectedRoutes = ({ children }: ProtectedRoutesProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
export default ProtectedRoutes;
