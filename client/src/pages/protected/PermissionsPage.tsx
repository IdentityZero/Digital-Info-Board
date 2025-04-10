import { Link, Outlet, useLocation } from "react-router-dom";
import useScrollToHash from "../../hooks/useScrollToHash";

const PermissionsPage = () => {
  const { pathname } = useLocation();

  useScrollToHash();

  const isIndex = !pathname.includes("inactive");

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[60px] flex flex-row mt-4">
        <Link
          to="/dashboard/permissions"
          className={`basis-1/2 font-bold h-full flex items-center justify-center text-base md:text-lg lg:text-xl text-center ${
            isIndex ? "bg-cyanBlue" : "bg-white"
          }`}
        >
          <p>Current Approved Contents</p>
        </Link>

        <Link
          to="/dashboard/permissions/inactive"
          className={`basis-1/2 font-bold h-full flex items-center justify-center text-base md:text-lg lg:text-xl text-center ${
            !isIndex ? "bg-cyanBlue" : "bg-white"
          }`}
        >
          For Approval
        </Link>
      </div>
      <Outlet />
    </div>
  );
};
export default PermissionsPage;
