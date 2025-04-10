import { Link, Outlet, useLocation } from "react-router-dom";

import SideDropdown, {
  DropdownContainer,
  SideDropdownItem,
} from "../../components/ui/SideDropdown";
import { Button } from "../../components/ui";

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
    <div>
      <div className="px-2 pt-2 md:px-5 md:pt-5 w-full flex flex-col sm:flex-row items-start gap-y-2 justify-between">
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
        <Link to={`/dashboard/upload-content/${get_type_location()}`}>
          <Button>Upload {get_type_location()} content</Button>
        </Link>
      </div>
      <div className="px-5">
        <Outlet />
      </div>
    </div>
  );
};

export default ContentsPage;
