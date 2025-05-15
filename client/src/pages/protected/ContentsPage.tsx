import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import SideDropdown, {
  DropdownContainer,
  SideDropdownItem,
} from "../../components/ui/SideDropdown";
import ButtonV2 from "../../components/ui/ButtonV2";

import TrashbinModal from "../../features/announcements/DeletedAnnouncement/TrashbinModal";
import { AnnouncementTypes } from "../../types/AnnouncementTypes";

type ContentLinkT = {
  label: AnnouncementTypes;
  to: AnnouncementTypes;
};
const links: ContentLinkT[] = [
  { label: "video", to: "video" },
  { label: "image", to: "image" },
  { label: "text", to: "text" },
  { label: "urgent", to: "urgent" },
];

const ContentsPage = () => {
  const location = useLocation();

  const [trashType, setTrashType] = useState<null | AnnouncementTypes>(null);

  const get_type_location = (): AnnouncementTypes => {
    const lastPart: string = location.pathname.split("/").pop() || "";

    if (lastPart === "edit") {
      // Since we are only supportint edit with urgent. Update when refactored
      return "urgent";
    }

    if (["video", "image", "text", "urgent"].includes(lastPart))
      return lastPart as AnnouncementTypes;
    if (lastPart === "contents") return "video";

    const pathParts = location.pathname.split("/");
    const secondToLastPart = pathParts[pathParts.length - 2] || "";
    if (["video", "image", "text", "urgent"].includes(secondToLastPart))
      return secondToLastPart as AnnouncementTypes;

    return "video";
  };

  return (
    <div>
      <div className="px-2 pt-2 md:px-5 md:pt-5 w-full flex flex-col sm:flex-row items-start gap-y-2 justify-between">
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
                className={`z-[9999] px-8 py-2 capitalize border-black border text-center hover:bg-cyanBlue-light active:bg-cyanBlue-dark ${
                  link.label === get_type_location() && "bg-cyanBlue"
                }`}
                isActiveClassName="bg-cyanBlue"
              >
                {link.label === "text" ? "News" : link.label}
              </SideDropdownItem>
            ))}
          </div>
        </SideDropdown>
        <div className="flex gap-2">
          <Link
            to={`/dashboard/upload-content/${get_type_location()}`}
            className="w-full"
          >
            <ButtonV2
              text={`Upload ${get_type_location()} content`}
              type="button"
            />
          </Link>
          {get_type_location() !== "urgent" && (
            <ButtonV2
              text="Trashbin"
              type="button"
              variant="danger"
              onClick={() => setTrashType(get_type_location())}
            />
          )}
        </div>
      </div>
      <div className="px-5">
        <Outlet />
      </div>
      {trashType && (
        <TrashbinModal
          onClose={() => setTrashType(null)}
          type={get_type_location()}
        />
      )}
    </div>
  );
};

export default ContentsPage;
