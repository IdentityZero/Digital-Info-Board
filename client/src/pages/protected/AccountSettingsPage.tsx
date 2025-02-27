import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const AccountSettingsPage = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div>
      <div className="w-full mt-4 px-4 grid grid-cols-3 gap-1">
        <NavLink
          to=""
          className={({ isActive }) =>
            `capitalize p-3 pl-6 flex h-14 flex-row items-center justify-center gap-3  border-black hover:bg-cyanBlue-dark active:bg-cyanBlue-darker ${
              (isActive && location.pathname == "/dashboard/account") ||
              location.pathname == "/dashboard/account/change-password"
                ? "font-bold bg-cyanBlue"
                : "border-2 border-black bg-white"
            } `
          }
        >
          My Profile
        </NavLink>

        {user?.is_admin && (
          <NavLink
            to="list-of-accounts"
            className={({ isActive }) =>
              `capitalize p-3 pl-6 flex h-14 flex-row items-center justify-center gap-3 hover:bg-cyanBlue-dark active:bg-cyanBlue-darker ${
                isActive
                  ? "font-bold bg-cyanBlue"
                  : "border-2 border-black bg-white"
              } `
            }
          >
            List of Accounts
          </NavLink>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default AccountSettingsPage;
