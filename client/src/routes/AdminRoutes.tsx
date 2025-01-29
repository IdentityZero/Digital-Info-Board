import { PropsWithChildren } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, Navigate } from "react-router-dom";

type AdminRoutes = PropsWithChildren;

const AdminRoutes = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.is_admin) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Permission Denied
          </h1>
          <p className="text-gray-700 mb-6">
            You do not have permission to view this page. If you believe this is
            an error, please contact the administrator or refresh the page.
          </p>
          <Link
            to={"/"}
            className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
export default AdminRoutes;
