import { Outlet, useLocation } from "react-router-dom";

import SideDropdown, {
  DropdownContainer,
  SideDropdownItem,
} from "../../components/ui/SideDropdown";

import { AnnouncementTypes } from "../../types/AnnouncementTypes";

type UploadContentLinkT = {
  label: AnnouncementTypes;
  to: AnnouncementTypes;
};
const links: UploadContentLinkT[] = [
  { label: "video", to: "video" },
  { label: "image", to: "image" },
  { label: "text", to: "text" },
  { label: "urgent", to: "urgent" },
];

const UploadContentPage = () => {
  const location = useLocation();

  const get_type_location = (): AnnouncementTypes => {
    const lastPart: string = location.pathname.split("/").pop() || "";

    if (["video", "image", "text", "urgent"].includes(lastPart))
      return lastPart as AnnouncementTypes;

    return "video";
  };

  return (
    <>
      <div className="p-5">
        <SideDropdown
          buttonContent={
            <DropdownContainer
              label={
                get_type_location() === "text" ? "News" : get_type_location()
              }
            />
          }
        >
          <div className="flex flex-col border-2 border-black bg-white">
            {links.map((link) => (
              <SideDropdownItem
                to={link.to}
                key={link.to}
                end
                className={`px-8 py-2 capitalize border-black border text-center hover:bg-cyanBlue-light active:bg-cyanBlue-dark ${
                  link.label === "video" &&
                  get_type_location() === "video" &&
                  "bg-cyanBlue"
                  // Handling index path
                }`}
                isActiveClassName="bg-cyanBlue"
              >
                {link.label === "text" ? "News" : link.label}
              </SideDropdownItem>
            ))}
          </div>
        </SideDropdown>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default UploadContentPage;
