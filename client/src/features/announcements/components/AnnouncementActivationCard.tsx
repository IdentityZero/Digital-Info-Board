import Button from "../../accounts/components/Button";
import { useAuth } from "../../../context/AuthProvider";

import {
  extractReactQuillText,
  formatStringUnderscores,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../utils/formatters";
import { addTotalDuration } from "../../../utils/utils";

import { AnnouncementRetrieveType } from "../../../types/AnnouncementTypes";

type Props = {
  announcement: AnnouncementRetrieveType;
  handleActivationClick: (id: string, data: any) => void;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setDataToPreview: React.Dispatch<
    React.SetStateAction<AnnouncementRetrieveType | undefined>
  >;
  isHighlighted?: boolean;
  handleDisplayPreviewClick: (id: string) => void;
};

const AnnouncementActivationCard = ({
  announcement,
  setShowPreview,
  setDataToPreview,
  handleActivationClick,
  isHighlighted = false,
  handleDisplayPreviewClick,
}: Props) => {
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
      className={`w-full bg-white border-2 border-black rounded-lg overflow-hidden ${
        isHighlighted && "shadow-[0_0_10px_rgba(255,255,0,0.8)]"
      }`}
      id={announcement.id}
    >
      {/* Author */}
      <p className="w-full bg-cyanBlue p-3 capitalize font-semibold text-sm sm:text-base md:text-lg rounded-none sm:rounded-t-lg">
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
          <span>{extractReactQuillText(announcement.title as string)}</span>
        </div>

        <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
          <span className="font-medium min-w-[150px] block">Display in:</span>
          <span>Main Display</span>
        </div>

        <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
          <span className="font-medium min-w-[150px] block">
            Time Duration:
          </span>
          <span>{duration}</span>
        </div>

        <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
          <span className="font-medium min-w-[150px] block">
            Display Dates:
          </span>
          <span>
            {formatTimestamp(announcement.start_date) +
              " to " +
              formatTimestamp(announcement.end_date)}
          </span>
        </div>

        {/* Text Announcement */}

        {announcement.text_announcement && (
          <p className="text-gray-600 flex flex-col sm:flex-row sm:items-start gap-1">
            <span className="font-medium min-w-[150px]">Details:</span>
            <span className="whitespace-pre-line">
              {truncateStringVariableLen(
                extractReactQuillText(
                  announcement.text_announcement.details as string
                ),
                200,
                200
              )}
            </span>
          </p>
        )}

        {/* Image Announcement */}

        {announcement.image_announcement &&
          announcement.image_announcement.length > 0 && (
            <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
              <span className="font-medium min-w-[150px] block mb-2 sm:mb-0">
                Images:
              </span>
              <div className="flex flex-col gap-2 w-full">
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
                      className="w-full flex flex-col sm:flex-row justify-between bg-yellowishBeige p-2 border border-black rounded"
                      key={image_announcement.id}
                    >
                      <a
                        href={`${image_announcement.image}`}
                        target="_blank"
                        className="underline decoration-blue-500 w-full truncate"
                      >
                        {getFilename()}
                      </a>
                      <p className="text-right sm:text-left">
                        {(image_announcement.file_size / (1024 * 1024)).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Video Announcement */}

        {announcement.video_announcement &&
          announcement.video_announcement.length > 0 && (
            <div className="text-gray-600 flex flex-col sm:flex-row sm:items-start">
              <span className="font-medium min-w-[150px] block mb-2 sm:mb-0">
                Videos:
              </span>
              <div className="flex flex-col gap-2 w-full">
                {announcement.video_announcement.map((video_announcement) => {
                  const getFilename = () => {
                    if (video_announcement.video instanceof File) {
                      return video_announcement.video.name;
                    } else if (typeof video_announcement.video === "string") {
                      return video_announcement.video.split("/").pop();
                    } else {
                      return "Invalid video format";
                    }
                  };

                  return (
                    <div
                      className="w-full flex flex-col sm:flex-row justify-between bg-yellowishBeige p-2 border border-black rounded"
                      key={video_announcement.id}
                    >
                      <a
                        href={`${video_announcement.video}`}
                        target="_blank"
                        className="underline decoration-blue-500 w-full truncate"
                      >
                        {getFilename()}
                      </a>
                      <p className="text-right sm:text-left">
                        {(video_announcement.file_size / (1024 * 1024)).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Buttons */}

        <div className="p-4 w-full flex flex-col sm:flex-row justify-end sm:items-center gap-2">
          {user?.id && String(user?.id) == announcement.author.id && (
            <div className="w-full sm:w-auto">
              <a
                href={`/dashboard/contents/${type}/${announcement.id}`}
                target="_blank"
              >
                <Button text="Edit" />
              </a>
            </div>
          )}
          <div className="w-full sm:w-auto">
            <Button
              text="Preview"
              onClick={() => {
                setShowPreview(true);
                setDataToPreview(announcement);
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Button
              text="Display Preview"
              onClick={() => {
                handleDisplayPreviewClick(announcement.id);
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Button
              text={announcement.is_active ? "Deactivate" : "Approve"}
              variant="secondary"
              onClick={() => {
                const data = {
                  title: announcement.title,
                  start_date: announcement.start_date,
                  end_date: announcement.end_date,
                  is_active: !announcement.is_active,
                };
                handleActivationClick(announcement.id, data);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnnouncementActivationCard;
