import { Outlet, useLocation } from "react-router-dom";

import SideDropdown, {
  DropdownContainer,
  SideDropdownItem,
} from "../../components/ui/SideDropdown";

type ContentType = "video" | "image" | "text";
type ContentLinkT = {
  label: ContentType;
  to: ContentType;
};
const links: ContentLinkT[] = [
  { label: "video", to: "video" },
  { label: "image", to: "image" },
  { label: "text", to: "text" },
];

const ContentsPage = () => {
  const location = useLocation();

  const get_type_location = () => {
    const lastPart: string = location.pathname.split("/").pop() || "";

    if (["video", "image", "text"].includes(lastPart)) return lastPart;
    if (lastPart === "contents") return "video";

    const pathParts = location.pathname.split("/");
    const secondToLastPart = pathParts[pathParts.length - 2] || "";
    if (["video", "image", "text"].includes(secondToLastPart))
      return secondToLastPart;

    return "video";
  };
  return (
    <div className="p-5">
      <SideDropdown
        buttonContent={<DropdownContainer label={get_type_location()} />}
      >
        <div className="flex flex-col border-2 border-black bg-white">
          {links.map((link) => (
            <SideDropdownItem
              to={link.to}
              key={link.to}
              end
              className={`z-[9999] px-8 py-2 capitalize border-black border text-center hover:bg-cyanBlue-light active:bg-cyanBlue-dark ${
                link.label === get_type_location() && "bg-cyanBlue"
              }`}
              isActiveClassName="bg-cyanBlue"
            >
              {link.label}
            </SideDropdownItem>
          ))}
        </div>
      </SideDropdown>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ContentsPage;
