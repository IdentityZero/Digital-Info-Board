import React, { useState } from "react";
import { updateAnnouncementApi } from "../../api/announcementRequest";
import { useAuth } from "../../context/AuthProvider";
import {
  AnnouncementListType,
  AnnouncementRetrieveType,
} from "../../types/AnnouncementTypes";
import {
  extractReactQuillText,
  formatStringUnderscores,
  formatTimestamp,
} from "../../utils/formatters";
import { addTotalDuration } from "../../utils/utils";
import PreviewAnnouncement from "./PreviewAnnouncement";

const ListActiveAnnouncement = ({
  activeAnnouncements,
  setActiveAnnouncements,
  setInactiveAnnouncements,
}: {
  activeAnnouncements: AnnouncementListType;
  setActiveAnnouncements: React.Dispatch<
    React.SetStateAction<AnnouncementListType>
  >;
  setInactiveAnnouncements: React.Dispatch<
    React.SetStateAction<AnnouncementListType>
  >;
}) => {
  const { userApi } = useAuth();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [dataToPreview, setDataToPreview] = useState<
    AnnouncementRetrieveType | undefined
  >(undefined);

  if (activeAnnouncements.length === 0) {
    return <div className="w-full p-4 text-center">List is empty...</div>;
  }

  const handleDeactivateClick = async (id: string, data: any) => {
    const deactivate_confirm = window.confirm(
      "Are you sure you want to deactivate this Content?"
    );

    if (!deactivate_confirm) return;
    try {
      await updateAnnouncementApi(userApi, id, data);
      const updatedData = activeAnnouncements.find(
        (announcement) => announcement.id === id
      );
      if (updatedData) {
        setInactiveAnnouncements((prev) => [...prev, updatedData]);
        const updatedActiveList = [
          activeAnnouncements.filter((announcement) => announcement.id !== id),
        ][0];

        setActiveAnnouncements(updatedActiveList);
      }
    } catch (error) {
      alert("Unexpected error occured. Please try again later.");
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
      {activeAnnouncements.map((announcement) => {
        return (
          <AnnouncementCard
            announcement={announcement}
            key={announcement.id}
            handleDeactivateClick={handleDeactivateClick}
            setShowPreview={setShowPreview}
            setDataToPreview={setDataToPreview}
          />
        );
      })}
    </div>
  );
};

type AnnouncementCardProps = {
  announcement: AnnouncementRetrieveType;
  handleDeactivateClick: (id: string, data: any) => void;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setDataToPreview: React.Dispatch<
    React.SetStateAction<AnnouncementRetrieveType | undefined>
  >;
};

function AnnouncementCard({
  announcement,
  handleDeactivateClick,
  setShowPreview,
  setDataToPreview,
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
    <div className="w-full bg-white border-2 border-black">
      <p className="w-full bg-cyanBlue p-3 capitalize font-semibold rounded-full">
        From:{" "}
        {announcement.author.first_name + " " + announcement.author.last_name}{" "}
        <span className="capitalize">
          ({formatStringUnderscores(announcement.author.profile.position)})
        </span>
      </p>
      <div className="p-2">
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
            className="bg-btSecondary active:bg-btSecondary-active hover:bg-btSecondary-hover py-2 px-4 rounded-full"
            onClick={() => {
              const data = {
                title: announcement.title,
                start_date: announcement.start_date,
                end_date: announcement.end_date,
                is_active: false,
              };
              handleDeactivateClick(announcement.id, data);
            }}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListActiveAnnouncement;
