import { useRef } from "react";
import { Id } from "react-toastify";
import { useLocation } from "react-router-dom";

import Button from "../../../components/ui/ButtonV2";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import {
  extractReactQuillText,
  formatStringUnderscores,
  truncateStringVariableLen,
} from "../../../utils/formatters";

import { UrgentAnnouncementType } from "../../../types/AnnouncementTypes";
import { updateUrgentAnnouncementApi } from "../../../api/announcementRequest";

type Props = {
  announcements: UrgentAnnouncementType[];
  setAnnouncements: (updatedList: UrgentAnnouncementType[]) => void;
};

const ListInactiveUrgentAnnouncement = ({
  announcements,
  setAnnouncements,
}: Props) => {
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const handleActivationClick = async (id: number) => {
    const conf = confirm("Are you sure you want to approve this content?");

    if (!conf) return;

    loading(`Approving - ${id}. Please wait...`);
    try {
      await updateUrgentAnnouncementApi(userApi, String(id), {
        is_approved: true,
      });
      const updateList = announcements.filter(
        (announcement) => announcement.id !== id
      );

      setAnnouncements(updateList);
      update({ render: "Approved Successfully.", type: "success" });
    } catch (error) {
      update({
        render: "Activation unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="px-4 mt-2 flex flex-col gap-2">
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          isHighlighted={targetId == `u${announcement.id}`}
          announcement={announcement}
          handleActivationClick={handleActivationClick}
        />
      ))}
    </div>
  );
};
export default ListInactiveUrgentAnnouncement;

type CardProps = {
  announcement: UrgentAnnouncementType;
  isHighlighted: boolean;
  handleActivationClick: (id: number) => void;
};

function AnnouncementCard({
  announcement,
  isHighlighted,
  handleActivationClick,
}: CardProps) {
  const { user } = useAuth();
  return (
    <div
      className={`w-full bg-white border-2 border-black rounded-lg overflow-hidden ${
        isHighlighted && "shadow-[0_0_10px_rgba(255,255,0,0.8)]"
      }`}
      id={`u${announcement.id}`}
    >
      {/* Author */}
      <p className="w-full bg-btDanger p-3 capitalize font-semibold text-sm sm:text-base md:text-lg rounded-none sm:rounded-t-lg">
        From:{" "}
        {announcement.author.first_name + " " + announcement.author.last_name}{" "}
        <span className="capitalize">
          ({formatStringUnderscores(announcement.author.profile.position)})
        </span>
      </p>

      {/* Announcement Details */}

      <div className="p-2 space-y-3 text-sm sm:text-base">
        <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
          <span className="font-medium min-w-[150px] block">ID:</span>
          <span>{announcement.id}</span>
        </div>

        <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
          <span className="font-medium min-w-[150px] block">Title:</span>
          <span>
            {extractReactQuillText(JSON.stringify(announcement.title))}
          </span>
        </div>

        <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
          <span className="font-medium min-w-[150px] block">Display in:</span>
          <span>Urgent Main Display</span>
        </div>

        {/* Text Announcement */}

        <p className="text-gray-600 flex flex-col sm:flex-row sm:items-start gap-1">
          <span className="font-medium min-w-[150px]">Details:</span>
          <span className="whitespace-pre-line">
            {truncateStringVariableLen(
              extractReactQuillText(JSON.stringify(announcement.description)),
              200,
              200
            )}
          </span>
        </p>

        {/* Buttons */}

        <div className="p-4 w-full flex flex-col sm:flex-row justify-end sm:items-center gap-2">
          {user?.id && String(user?.id) == announcement.author.id && (
            <div className="w-full sm:w-auto">
              <a
                href={`/dashboard/contents/urgent/${announcement.id}`}
                target="_blank"
              >
                <Button text="Edit" />
              </a>
            </div>
          )}
          <div className="w-full sm:w-auto">
            <Button
              text={announcement.is_approved ? "Deactivate" : "Approve"}
              variant="secondary"
              onClick={() => {
                handleActivationClick(announcement.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
