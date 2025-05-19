import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type PublicRouteGuardProps = {
  children: React.ReactNode;
};

const PublicRouteGuard = ({ children }: PublicRouteGuardProps) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  if (user) {
    const next = searchParams.get("next");
    if (next) {
      return <Navigate to={`${next}${targetId && `#${targetId}`}`} />;
    }

    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
export default PublicRouteGuard;
