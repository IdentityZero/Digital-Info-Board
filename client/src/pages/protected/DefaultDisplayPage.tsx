import { NavLink, Outlet } from "react-router-dom";
import useScrollToHash from "../../hooks/useScrollToHash";

const LINKS = [
  { label: "Settings", url: "" },
  { label: "Organization", url: "organization" },
  { label: "Upcoming Events", url: "events" },
  { label: "Media Displays", url: "media" },
];

const DefaultDisplayPage = () => {
  useScrollToHash();

  return (
    <div className="p-4">
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {LINKS.map((link, index) => (
          <NavLink
            key={index}
            to={link.url}
            className={({ isActive }) =>
              `font-bold text-base md:text-lg lg:text-xl text-center p-2 ${
                isActive ? "bg-cyanBlue" : "bg-white border-2 border-black"
              }`
            }
            end
          >
            {link.label}
          </NavLink>
        ))}
      </section>
      <section className="mt-2">
        <Outlet />
      </section>
    </div>
  );
};
export default DefaultDisplayPage;
