import { useLocation, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaUser, FaPowerOff, FaBell } from "react-icons/fa";

import { extractUrlname } from "../../utils/formatters";
import { useAuth } from "../../context/AuthProvider";
import { type FullUserType } from "../../types/UserTypes";
import { retrieveUserInformation } from "../../api/userRequest";
import Dropdown, { DropdownContext } from "../ui/Dropdown";

import NotificationContainer from "../../features/notifications/NotificationContainer";
import { useNotificationContext } from "../../context/Notification";

const DashboardTopbar = () => {
  const location = useLocation();
  const { user, userApi } = useAuth();
  const { notifications, markNotificationRead, handleLoadMore } =
    useNotificationContext();
  const [fetchedUser, setFetchedUser] = useState<FullUserType | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await retrieveUserInformation(userApi, user?.id as string);
        setFetchedUser(data);
      } catch (error) {}
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="relative group h-20 z-50">
      <div
        className={`${
          fetchedUser && "group-hover:opacity-0"
        } opacity-100 font-bold text-xl h-full uppercase flex items-center pl-3 transition-all duration-300 ease-in-out`}
      >
        {extractUrlname(location.pathname)}
      </div>
      {fetchedUser && (
        <div className="opacity-0 group-hover:opacity-100 group-hover:flex hidden absolute top-0 left-0 h-full w-full capitalize items-center justify-between px-3 transition-all duration-300 ease-in-out border-b border-black">
          <p className="text-xl font-bold">Welcome back, {user?.username}!</p>
          <div className="flex gap-2 items-center">
            <Dropdown buttonContent={<Userbox user={fetchedUser} />}>
              <ul className="bg-cyanBlue px-1 py-2 flex flex-col gap-1">
                <DropdownContentContainer
                  label="Update Profile"
                  icon={FaUser}
                  to="/dashboard/account"
                />
                <DropdownContentContainer
                  label="Log Out"
                  icon={FaPowerOff}
                  to="/dashboard/logout"
                />
              </ul>
            </Dropdown>
            <Dropdown
              showArrow={false}
              buttonContent={
                <NotificationIcon
                  notificationCount={notifications.unread_count}
                />
              }
            >
              <ul className="bg-cyanBlue-darker p-2 flex flex-col gap-1 w-fit h-[70vh] overflow-auto mt-2 rounded-lg custom-scrollbar">
                {notifications && notifications.results.length > 0 ? (
                  <>
                    {notifications.results.map((notification) => (
                      <NotificationContainer
                        key={notification.id}
                        notification={notification}
                        onClick={markNotificationRead}
                      />
                    ))}
                    {notifications.next ? (
                      <button
                        className="bg-cyanBlue hover:bg-cyanBlue-dark py-2 text-white"
                        onClick={handleLoadMore}
                      >
                        Load more
                      </button>
                    ) : (
                      <span className="bg-cyanBlue hover:bg-cyanBlue-dark py-2 text-white text-center">
                        You have reached the end.
                      </span>
                    )}
                  </>
                ) : (
                  <div className="w-[360px] text-center mt-2 text-white">
                    You don't have notifications.
                  </div>
                )}
              </ul>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
};

function Userbox({ user }: { user: FullUserType }) {
  const full_name = user.first_name + " " + user.last_name;
  const dropdownContext = useContext(DropdownContext);

  if (!dropdownContext) {
    throw new Error("Dropdown context must be within a Dropdown Provider");
  }

  const { isExpanded, setIsExpanded } = dropdownContext;

  return (
    <div
      className={`${
        isExpanded &&
        "bg-[linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)_50%,#55a2d1_50%)]"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="bg-cyanBlue  h-12 py-1 pr-5 rounded-full flex flex-row gap-1.5">
        <div className="pl-2 py-1">
          <img
            src={user.profile.image as string}
            alt="thumbnail"
            className="h-8 w-8 rounded-full border border-white"
          />
        </div>
        <div className="flex flex-col -space-y-1">
          <div className="flex flex-row items-center space-x-2 justify-between cursor-pointer">
            <p className="font-semibold pr-4">{full_name}</p>
          </div>

          <p className="text-xs">
            {user.profile.role} | {user.profile.position}
          </p>
        </div>
      </div>
    </div>
  );
}

type DropdownContentType = {
  label: string;
  icon: IconType;
  to: string;
};

function DropdownContentContainer({
  label,
  icon: Icon,
  to,
}: DropdownContentType) {
  const dropdownContext = useContext(DropdownContext);

  if (!dropdownContext) {
    throw new Error("Dropdown Context must be within a Dropdown provider");
  }

  const { setIsExpanded } = dropdownContext;

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsExpanded(false);

    if (label !== "Log Out") return;

    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      e.preventDefault();
    }
  };

  return (
    <Link to={to} onClick={handleLogoutClick}>
      <div className="bg-vanilla-100 h-12 pl-4 p-1 rounded-full flex flex-row items-center gap-1.5">
        <Icon />
        <p className="font-semibold">{label}</p>
      </div>
    </Link>
  );
}

function NotificationIcon({ notificationCount = 0 }) {
  return (
    <div className="relative">
      <div className="text-white bg-cyanBlue p-3 rounded-full text-2xl transition-transform duration-300 hover:scale-110 relative">
        <FaBell />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {notificationCount}
          </span>
        )}
      </div>
    </div>
  );
}

export default DashboardTopbar;
