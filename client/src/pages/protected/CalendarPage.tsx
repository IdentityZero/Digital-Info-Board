import { NavLink, Outlet } from "react-router-dom";

const LINKS = [
  { label: "Calendar", url: "calendar" },
  { label: "Settings", url: "settings" },
];

const CalendarPage = () => {
  return (
    <div className="p-4">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-1">
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
export default CalendarPage;
