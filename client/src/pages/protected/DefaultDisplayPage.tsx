import { NavLink, Outlet } from "react-router-dom";

const LINKS = [
  { label: "Settings", url: "" },
  { label: "Organization", url: "organization" },
  { label: "Upcoming Events", url: "events" },
  { label: "Media Displays", url: "media" },
  { label: "Weather Forecast", url: "forecast" },
  { label: "Calendar", url: "calendar" },
];

const DefaultDisplayPage = () => {
  return (
    <div className="p-4">
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
        {LINKS.map((link, index) => (
          <NavLink
            key={index}
            to={link.url}
            className={({ isActive }) =>
              `font-bold text-xl text-center p-2 ${
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
