import {
  extractReactQuillText,
  formatStringUnderscores,
  formatTimestamp,
} from "../../utils/formatters";
import { addTotalDuration } from "../../utils/utils";
import {
  type AnnouncementListType,
  AnnouncementRetrieveType,
} from "../../types/AnnouncementTypes";
import { updateAnnouncementApi } from "../../api/announcementRequest";
import { useAuth } from "../../context/AuthProvider";
import { useRef, useState } from "react";
import PreviewAnnouncement from "./PreviewAnnouncement";
import { Id } from "react-toastify";
import useLoadingToast from "../../hooks/useLoadingToast";
import { useLocation } from "react-router-dom";

type ListInactiveAnnouncementProps = {
  inactiveAnnouncements: AnnouncementListType;

  setInactiveAnnouncements: React.Dispatch<
    React.SetStateAction<AnnouncementListType>
  >;
};

const ListInactiveAnnouncement = ({
  inactiveAnnouncements,
  setInactiveAnnouncements,
}: ListInactiveAnnouncementProps) => {
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [dataToPreview, setDataToPreview] = useState<
    AnnouncementRetrieveType | undefined
  >(undefined);

  if (inactiveAnnouncements.length === 0) {
    return <div className="w-full p-4 text-center">List is empty...</div>;
  }

  const handleApproveClick = async (id: string, data: any) => {
    const approve_confirm = window.confirm(
      "Are you sure you want to approve this Content?"
    );

    if (!approve_confirm) return;

    loading(`Approving - ${id}. Please wait...`);

    try {
      await updateAnnouncementApi(userApi, id, data);
      const updatedData = inactiveAnnouncements.find(
        (announcement) => announcement.id === id
      );
      if (updatedData) {
        const updatedInActiveList = [
          inactiveAnnouncements.filter(
            (announcement) => announcement.id !== id
          ),
        ][0];

        update({ render: "Activation successful", type: "success" });

        setInactiveAnnouncements(updatedInActiveList);
      }
    } catch (error) {
      update({
        render: "Activation unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      {showPreview && (
        <PreviewAnnouncement
          setShowPreview={setShowPreview}
          data={dataToPreview as AnnouncementRetrieveType}
        />
      )}
      {inactiveAnnouncements.map((announcement) => {
        return (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement as AnnouncementRetrieveType}
            handleApproveClick={handleApproveClick}
            setShowPreview={setShowPreview}
            setDataToPreview={setDataToPreview}
            isHighlighted={targetId == announcement.id}
          />
        );
      })}
    </div>
  );
};

type AnnouncementCardProps = {
  announcement: AnnouncementRetrieveType;
  handleApproveClick: (id: string, data: any) => void;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setDataToPreview: React.Dispatch<
    React.SetStateAction<AnnouncementRetrieveType | undefined>
  >;
  isHighlighted?: boolean;
};

function AnnouncementCard({
  announcement,
  handleApproveClick,
  setShowPreview,
  setDataToPreview,
  isHighlighted = false,
}: AnnouncementCardProps) {
  const { user } = useAuth();

  let duration: any;
  let type: "text" | "image" | "video" | "none";

  if (announcement.text_announcement) {
    duration = announcement.text_announcement.duration;
    type = "text";
  } else if (
    announcement.image_announcement &&
    announcement.image_announcement.length > 0
  ) {
    duration = addTotalDuration(announcement.image_announcement);
    type = "image";
  } else if (
    announcement.video_announcement &&
    announcement.video_announcement.length > 0
  ) {
    duration = addTotalDuration(announcement.video_announcement);
    type = "video";
  } else {
    duration = "Cannot be determined.";
    type = "none";
  }

  return (
    <div
      className={`w-full bg-white border-2 border-black ${
        isHighlighted && "shadow-[0_0_10px_rgba(255,255,0,0.8)]"
      }`}
      id={announcement.id}
    >
      <p className="w-full bg-cyanBlue p-3 capitalize font-semibold rounded-full">
        From:{" "}
        {announcement.author.first_name + " " + announcement.author.last_name}{" "}
        <span className="capitalize">
          ({formatStringUnderscores(announcement.author.profile.position)})
        </span>
      </p>
      <div className="p-2">
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">ID:</span>
          <span>{announcement.id}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Title:</span>
          <span>{extractReactQuillText(announcement.title as string)}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Display in:</span>
          <span>Main Display</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">
            Time Duration:
          </span>
          <span>{duration}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">
            Display Dates:
          </span>
          <span>
            {formatTimestamp(announcement.start_date) +
              " to " +
              formatTimestamp(announcement.end_date)}
          </span>
        </p>

        {announcement.text_announcement && (
          <p className="text-sm text-gray-600 flex items-start">
            <span className="font-medium min-w-[150px] block">Details</span>
            <span>
              {extractReactQuillText(
                announcement.text_announcement.details as string
              )}
            </span>
          </p>
        )}

        {announcement.image_announcement &&
          announcement.image_announcement.length > 0 && (
            <div className="text-sm text-gray-600 flex items-start">
              <span className="font-medium min-w-[150px] block">Images:</span>
              <span className="flex flex-col gap-2 w-full">
                {announcement.image_announcement.map((image_announcement) => {
                  const getFilename = () => {
                    if (image_announcement.image instanceof File) {
                      return image_announcement.image.name;
                    } else if (typeof image_announcement.image === "string") {
                      return image_announcement.image.split("/").pop();
                    } else {
                      return "Invalid image format";
                    }
                  };

                  return (
                    <div
                      className="w-full flex flex-row justify-between bg-yellowishBeige p-2 border border-black"
                      key={image_announcement.id}
                    >
                      <a
                        href={`${image_announcement.image}`}
                        target="_blank"
                        className="underline decoration-blue-500"
                      >
                        {getFilename()}
                      </a>
                      <p>
                        {(image_announcement.file_size / (1024 * 1024)).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  );
                })}
              </span>
            </div>
          )}

        {announcement.video_announcement &&
          announcement.video_announcement.length > 0 && (
            <div className="text-sm text-gray-600 flex items-start">
              <span className="font-medium min-w-[150px] block">Videos:</span>
              <span className="flex flex-col gap-2 w-full">
                {announcement.video_announcement.map((video_announcement) => {
                  const getFilename = () => {
                    if (video_announcement.video instanceof File) {
                      return video_announcement.video.name;
                    } else if (typeof video_announcement.video === "string") {
                      return video_announcement.video.split("/").pop();
                    } else {
                      return "Invalid image format";
                    }
                  };

                  return (
                    <div
                      className="w-full flex flex-row justify-between bg-yellowishBeige p-2 border border-black"
                      key={video_announcement.id}
                    >
                      <a
                        href={`${video_announcement.video}`}
                        target="_blank"
                        className="underline decoration-blue-500"
                      >
                        {getFilename()}
                      </a>
                      <p>
                        {(video_announcement.file_size / (1024 * 1024)).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  );
                })}
              </span>
            </div>
          )}

        <div className="p-4 w-full flex flex-row justify-end gap-2">
          {user?.id && String(user?.id) == announcement.author.id && (
            <a
              href={`/dashboard/contents/${type}/${announcement.id}`}
              target="_blank"
              className="bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker py-2 px-4 rounded-full"
            >
              Edit
            </a>
          )}
          <button
            className="bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker py-2 px-4 rounded-full"
            onClick={() => {
              setShowPreview(true);
              setDataToPreview(announcement);
            }}
          >
            Preview
          </button>
          <button
            onClick={() => {
              const data = {
                title: announcement.title,
                start_date: announcement.start_date,
                end_date: announcement.end_date,
                is_active: true,
              };
              handleApproveClick(announcement.id, data);
            }}
            className="bg-cyanBlue hover:bg-cyanBlue-dark active:bg-cyanBlue-darker py-2 px-4 rounded-full"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListInactiveAnnouncement;
